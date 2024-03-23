# Dev Notes

## Code Locations

File Validation
packages\renderer\src\lib\validate-file_FileValidator.ts

Spreadsheet Downloading
packages\renderer\src\components\Spreadsheet.vue ->
packages\renderer\src\lib\io\index.ts

## Questions

Can spreadsheet be editable?
How is Save Charts to PDF supposed to work?
Where to get icons? -- Feather Icons

How to update output columns of a report?
Use Weekly Payroll for example:
Say to remove columns, the files you'll need to change are in `packages\renderer\src\reports\WeeklyPayroll`.
Go to the `ReportDef.ts` and update the `Columns` export. Then update the object returned by the `findEmp` function in `process.ts`. Finally, update the `types.d.ts` file to reflect the changes.

## Improve

- Table component
  - Surely there's a nice vue table package?
