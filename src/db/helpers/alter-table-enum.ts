export const alterTableEnum = (tableName: string, columnName: string, values: string[]) => {
  const constraintName = `${tableName}_${columnName}_check`;

  return [
    `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
    `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK ("${columnName}" = ANY (ARRAY['${values.join(
      // tslint:disable-next-line: quotemark
      "'::text, '",
    )}'::text]));`,
  ].join('\n');
};
