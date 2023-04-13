-- CreateTable
CREATE TABLE "public"."system_roles" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "system_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_system_roles" (
    "userId" VARCHAR(36) NOT NULL,
    "systemRoleId" VARCHAR(36) NOT NULL,

    CONSTRAINT "user_system_roles_pkey" PRIMARY KEY ("userId","systemRoleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_roles_name_key" ON "public"."system_roles"("name");

-- AddForeignKey
ALTER TABLE "public"."user_system_roles" ADD CONSTRAINT "user_system_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_system_roles" ADD CONSTRAINT "user_system_roles_systemRoleId_fkey" FOREIGN KEY ("systemRoleId") REFERENCES "public"."system_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
