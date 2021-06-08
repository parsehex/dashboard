# Payroll Options file

This is a custom file that's used to set some options for Payroll.

The spreadsheet should have the following sheets, each containing a table with the columns listed under each of the below:

- [`Hours Limits`]: For setting limits on specific employees' hours.
  - `Name`: Name of employee
  - `Limit`: Maximum number of hours to limit the employee.
- [`Salaried Employees`]: List of employees on salary.
  - `Name`: Name of employee
- [`Billing Counselor Override`]: Override the rendering counselor on a per-patient basis.
  - `Patient Name`
  - `Billing Counselor`: The name of the counselor that sessions are billed as
  - `Rendering Counselor`: The name of the counselor that should be used when the name in `Billing Counselor` column shows up in billing
- `Rates`
  - `Name`: Name of employee
- `Aliases`

[`hours limits`]: #hours-limits
[`salaried employees`]: #salaried-employees
[`billing counselor override`]: #billing-counselor-override
[`rates`]: #rates
[`aliases`]: #aliases

## Hours Limits

Set a maximum number of hours that employees are capped to. This sets a maximum for the calculated `Total Hrs` and doesn't affect `Admin Hrs` and `Clin Hrs`.

## Salaried Employees

A list of employees that are on salary. Salaried employees have their `Admin Hrs` calculated as follows:

`MAX(40 - C, 0)` where C = `Clin Hrs`

Example: Employee A is salaried and has 15 `Clin Hrs`. Their `Admin Hrs` would be 25.

This calculated number will not be negative.

### Table Columns

- `Name`

## Billing Counselor Override

This table lets you change which counselor gets credit for certain sessions on a per-patient basis.

For example, Medicare patients that are billed as a different counselor than the counselor that renders the services can be corrected when calculating how many sessions each counselor had.

### Table Columns

- `Patient Name`
- `Billing Counselor`
- `Rendering Counselor`: The counselor that should be substituted when `Billing Counselor` is shown as the Clinician Name in the billing statement.

## Rates

The hourly rates for each employee. You can set the rate for Admin hours, Clin hours, or just set the IOP rate manually.

This table is used as a source for the list of employees, so it should be kept up to date to minimize discrepencies. Precautions have been taken to ensure

### IOP Rate

The IOP Rate for an employee is calculated using one the columns in this table. You can manually set the IOP Rate by setting the `IOP` column. If there's no `IOP` set, then the `Clin` column is used as the IOP Rate. If there's no `Clin` value, then `Admin` column is used.

### Table Columns

- `Name`
- `Admin`: Rate to use for Admin hours
- `Clin`: Rate to use for Clin hours
- `IOP`: Optionally set the IOP manually for an employee

## Aliases

A lookup table to match the same person's name across different data sources.

For instance, if a counselor's name in TherapyNotes is different than their name in Payroll, then these different names should be added here.

### Table Columns

- `Name`
- `Alias`: A different name for the same employee
