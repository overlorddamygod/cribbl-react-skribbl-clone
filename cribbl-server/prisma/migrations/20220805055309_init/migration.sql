-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserGame" ("gameId", "id", "userId") SELECT "gameId", "id", "userId" FROM "UserGame";
DROP TABLE "UserGame";
ALTER TABLE "new_UserGame" RENAME TO "UserGame";
CREATE TABLE "new_GameScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    CONSTRAINT "GameScore_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameScore" ("gameId", "id", "round", "score", "userId") SELECT "gameId", "id", "round", "score", "userId" FROM "GameScore";
DROP TABLE "GameScore";
ALTER TABLE "new_GameScore" RENAME TO "GameScore";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
