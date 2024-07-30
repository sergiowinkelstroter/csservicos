import { PrismaClient } from "@prisma/client";
import { unlink as unlinkCallback } from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const prisma = new PrismaClient();
const execPromise = util.promisify(exec);
const unlinkPromise = util.promisify(unlinkCallback);

const DB_BACKUPS_FOLDER = process.env.DB_BACKUPS_FOLDER as string;
const DB_CONTAINER_NAME = process.env.DB_CONTAINER_NAME as string;
const DATABASE_CONTAINER = process.env.DATABASE_CONTAINER as string;
const DATABASE_URL = process.env.DATABASE_URL as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getBackupFilename(backupId: number): Promise<string> {
  const backup = await prisma.backups.findUnique({
    where: { id: backupId },
  });

  if (!backup) {
    throw new Error(`Backup not found with ID ${backupId}`);
  }

  return backup.filename;
}

async function executeCommand(command: string): Promise<void> {
  try {
    await execPromise(command);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Command failed: ${error.message}`);
    } else {
      throw new Error(`Command failed: ${error}`);
    }
  }
}

async function adjustSequences() {
  const adjustSequencesCommand = `docker exec ${DB_CONTAINER_NAME} psql -U postgres -d ${DATABASE_NAME} -c "SELECT reset_sequences();"`;
  await execPromise(adjustSequencesCommand);
}

async function restoreDatabase(filePath: string): Promise<void> {
  const restoreCommand = `docker exec -i ${DB_CONTAINER_NAME} pg_restore -U postgres -d ${DATABASE_NAME} < ${filePath}`;
  await executeCommand(restoreCommand);
  await adjustSequences();
}

async function databaseExists(databaseName: string): Promise<boolean> {
  const checkDbCommand = `docker exec ${DB_CONTAINER_NAME} psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='${databaseName}'"`;
  try {
    const { stdout } = await execPromise(checkDbCommand);
    return stdout.includes("1");
  } catch (error) {
    return false;
  }
}

async function createTempDatabase(tempDatabaseName: string) {
  if (await databaseExists(tempDatabaseName)) {
    const dropDbCommand = `docker exec ${DB_CONTAINER_NAME} dropdb -U postgres ${tempDatabaseName}`;
    await executeCommand(dropDbCommand);
  }
  const createDbCommand = `docker exec ${DB_CONTAINER_NAME} createdb -O postgres -U postgres ${tempDatabaseName}`;
  await executeCommand(createDbCommand);
}

async function dropTempDatabase(tempDatabaseName: string): Promise<void> {
  const dropDbCommand = `docker exec ${DB_CONTAINER_NAME} dropdb -U postgres ${tempDatabaseName}`;
  await executeCommand(dropDbCommand);
}

async function getBackup(userId: number, backupId: number) {
  const filename = await getBackupFilename(backupId);
  const filePath = path.join(DB_BACKUPS_FOLDER, filename);
  const tempDatabaseName = `temp_db_${userId}_${backupId}`;

  await createTempDatabase(tempDatabaseName);

  const restoreCommand = `docker exec -i ${DB_CONTAINER_NAME} pg_restore -U postgres -d ${tempDatabaseName} < ${filePath}`;
  await executeCommand(restoreCommand);

  return { tempDatabaseName, filePath };
}

async function getUserData(tempDatabaseName: string, userId: number) {
  const tempDatabaseUrl = `${DATABASE_CONTAINER}${tempDatabaseName}`;
  const tempPrisma = new PrismaClient({
    datasources: {
      db: {
        url: tempDatabaseUrl,
      },
    },
  });

  const userData = await tempPrisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      schedules: true,
      providedSchedules: true,
    },
  });

  await tempPrisma.$disconnect();

  if (!userData) {
    throw new Error(`User data not found with ID ${userId} in the backup`);
  }

  return userData;
}

async function restoreUserData(userId: number, userData: any) {
  await prisma.$transaction(async (tx) => {
    await tx.schedule.deleteMany({ where: { userId } });
    await tx.schedule.deleteMany({ where: { providerId: userId } });
    await tx.address.deleteMany({ where: { userId } });

    await tx.user.upsert({
      where: { id: userId },
      update: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        googleId: userData.googleId,
        fone: userData.fone,
        role: userData.role,
        updatedAt: new Date(),
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        googleId: userData.googleId,
        fone: userData.fone,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: new Date(),
      },
    });

    await tx.address.createMany({ data: userData.addresses });
    await tx.schedule.createMany({ data: userData.schedules });
    await tx.schedule.createMany({ data: userData.providedSchedules });
  });
}

export async function createBackup(userId: number) {
  const uuid = generateUUID();
  const fileName = `${uuid}.bak`;
  const filePath = path.join(DB_BACKUPS_FOLDER, fileName);

  const command = `pg_dump -Fc -f ${filePath} ${DATABASE_URL}`;

  try {
    await execPromise(command);

    const backup = await prisma.backups.create({
      data: {
        name: `Backup-${new Date().toISOString()}`,
        filename: fileName,
        userId: userId,
      },
    });

    return backup;
  } catch (error) {
    console.error("Error creating backup:", error);
    throw new Error("Error creating backup");
  }
}

export async function deleteBackup(backupId: number) {
  try {
    const filename = await getBackupFilename(backupId);
    const filePath = path.join(DB_BACKUPS_FOLDER, filename);

    await prisma.backups.delete({
      where: { id: backupId },
    });

    await unlinkPromise(filePath);

    console.log("Backup deleted successfully");
  } catch (error) {
    console.error("Error deleting backup:", error);
    throw new Error("Error deleting backup");
  }
}

export async function restoreBackup(userId: number, backupId: number) {
  try {
    const { tempDatabaseName, filePath } = await getBackup(userId, backupId);
    const userData = await getUserData(tempDatabaseName, userId);

    await restoreUserData(userId, userData);
    await dropTempDatabase(tempDatabaseName);

    console.log(`Backup restored for user with ID ${userId}`);
  } catch (error) {
    console.error("Error restoring backup:", error);
    throw new Error("Error restoring backup");
  }
}

export async function restoreFullBackup(backupId: number) {
  try {
    const filename = await getBackupFilename(backupId);
    const filePath = path.join(DB_BACKUPS_FOLDER, filename);

    await restoreDatabase(filePath);

    console.log("Full backup restored successfully");
  } catch (error) {
    console.error("Error restoring full backup:", error);
    throw new Error("Error restoring full backup");
  }
}
