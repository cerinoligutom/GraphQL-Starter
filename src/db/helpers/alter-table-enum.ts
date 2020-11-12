export const alterTableEnum = (tableName: string, columnName: string, values: string[]): string => {
  const constraintName = `${tableName}_${columnName}_check`;

  return [
    `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
    `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK ("${columnName}" = ANY (ARRAY['${values.join(
      // eslint-disable-next-line quotes
      "'::text, '",
    )}'::text]));`,
  ].join('\n');
};
