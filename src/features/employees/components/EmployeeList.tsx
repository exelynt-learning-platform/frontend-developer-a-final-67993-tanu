import { useState, type MouseEvent } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { Employee } from '../types'

interface EmployeeListProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

interface EmployeeField {
  key: keyof Employee
  label: string
}

const SUMMARY_FIELDS: EmployeeField[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'country', label: 'Country' },
]

const DETAIL_FIELDS: EmployeeField[] = [
  { key: 'countryId', label: 'Country ID' },
  { key: 'state', label: 'State' },
  { key: 'district', label: 'District' },
  { key: 'department', label: 'Department' },
]

const TABLE_COLUMN_COUNT = SUMMARY_FIELDS.length + 2

const COLUMN_WIDTHS = ['64px', '80px', '16%', '22%', '14%', '14%', '180px']

const tableBorder = {
  border: '1px solid',
  borderColor: 'grey.300',
}

function toCamelCaseDisplay(value: string) {
  return value
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => {
          if (!part) {
            return part
          }

          if (part.length <= 3 && part === part.toUpperCase()) {
            return part
          }

          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        })
        .join('-'),
    )
    .join(' ')
}

function formatField(value: string | undefined, preserveCase = false) {
  const trimmed = value?.trim()

  if (!trimmed || /^invalid faker method/i.test(trimmed)) {
    return 'NULL'
  }

  return preserveCase ? trimmed : toCamelCaseDisplay(trimmed)
}

function getFieldValue(employee: Employee, key: keyof Employee) {
  const preserveCase = key === 'email'
  return formatField(employee[key], preserveCase)
}

function isImageSrc(value: string | undefined) {
  return Boolean(value && /^(https?:\/\/|data:)/i.test(value))
}

function EmployeeAvatar({ employee }: { employee: Employee }) {
  const avatar = employee.avatar?.trim()
  const imageSrc = isImageSrc(avatar) ? avatar : undefined

  return (
    <Avatar
      src={imageSrc}
      alt={employee.name}
      sx={{ width: 36, height: 36 }}
    >
      {employee.name.trim().charAt(0) || '?'}
    </Avatar>
  )
}

function EmployeeActions({
  employee,
  isExpanded,
  onViewMore,
  onEdit,
  onDelete,
}: {
  employee: Employee
  isExpanded: boolean
  onViewMore: (employeeId: string) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}) {
  const displayName = formatField(employee.name)

  function stopRowToggle(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  return (
    <Box
      component="span"
      onClick={stopRowToggle}
      onMouseDown={stopRowToggle}
      sx={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Button
        type="button"
        size="small"
        onClick={() => onViewMore(employee.id)}
        aria-label={`${isExpanded ? 'View less' : 'View more'} for ${displayName}`}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'View less' : 'View more'}
      </Button>
      <IconButton
        aria-label={`Edit ${displayName}`}
        size="small"
        onClick={() => onEdit(employee)}
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label={`Delete ${displayName}`}
        size="small"
        color="error"
        onClick={() => onDelete(employee)}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export function EmployeeList({
  employees,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(
    null,
  )

  function handleToggleDetails(employeeId: string) {
    setExpandedEmployeeId((currentId) =>
      currentId === employeeId ? null : employeeId,
    )
  }

  function handleRowClick(event: MouseEvent<HTMLElement>, employeeId: string) {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    handleToggleDetails(employeeId)
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          display: { xs: 'none', sm: 'block' },
          overflowX: 'auto',
          ...tableBorder,
          borderRadius: 1,
        }}
      >
        <Table
          aria-label="Employees"
          size="small"
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            borderCollapse: 'collapse',
            '& .employee-data-row .MuiTableCell-root': {
              px: 1,
              py: 0.75,
              ...tableBorder,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              px: 1,
              py: 0.75,
              ...tableBorder,
              bgcolor: 'grey.50',
              fontWeight: 600,
            },
            '& .employee-details-row .MuiTableCell-root': {
              px: 1.5,
              py: 1,
              ...tableBorder,
              overflow: 'visible',
            },
          }}
        >
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              {SUMMARY_FIELDS.map((field) => (
                <TableCell key={field.key}>{field.label}</TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.flatMap((employee) => {
              const isExpanded = expandedEmployeeId === employee.id
              const rows = [
                <TableRow
                  key={employee.id}
                  className="employee-data-row"
                  hover
                  onClick={(event) => handleRowClick(event, employee.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <EmployeeAvatar employee={employee} />
                  </TableCell>
                  {SUMMARY_FIELDS.map((field) => (
                    <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>
                      {getFieldValue(employee, field.key)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <EmployeeActions
                      employee={employee}
                      isExpanded={isExpanded}
                      onViewMore={handleToggleDetails}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>,
              ]

              if (isExpanded) {
                rows.push(
                  <TableRow
                    key={`${employee.id}-details`}
                    className="employee-details-row"
                  >
                    <TableCell
                      colSpan={TABLE_COLUMN_COUNT}
                      role="region"
                      aria-label={`Location details for ${formatField(employee.name)}`}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            sm: '1fr 1fr',
                            md: 'repeat(4, minmax(0, 1fr))',
                          },
                          gap: 1,
                        }}
                      >
                        {DETAIL_FIELDS.map((field) => (
                          <Typography key={field.key} variant="body2">
                            <strong>{field.label} :</strong>{' '}
                            {getFieldValue(employee, field.key)}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>,
                )
              }

              return rows
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        spacing={2}
        sx={{ display: { xs: 'flex', sm: 'none' } }}
        aria-label="Employees"
      >
        {employees.map((employee) => {
          const isExpanded = expandedEmployeeId === employee.id

          return (
            <Card
              key={employee.id}
              component="article"
              variant="outlined"
              onClick={(event) => handleRowClick(event, employee.id)}
              sx={{ borderColor: 'grey.300', cursor: 'pointer' }}
            >
              <CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <EmployeeAvatar employee={employee} />
                  <Typography variant="h6" component="h2">
                    {getFieldValue(employee, 'name')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gap: 0.75 }}>
                  {SUMMARY_FIELDS.map((field) => (
                    <Typography key={field.key} variant="body2">
                      <strong>{field.label} :</strong>{' '}
                      {getFieldValue(employee, field.key)}
                    </Typography>
                  ))}
                  {isExpanded ? (
                    <Box
                      role="region"
                      aria-label={`Location details for ${formatField(employee.name)}`}
                    >
                      {DETAIL_FIELDS.map((field) => (
                        <Typography key={field.key} variant="body2">
                          <strong>{field.label} :</strong>{' '}
                          {getFieldValue(employee, field.key)}
                        </Typography>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <EmployeeActions
                  employee={employee}
                  isExpanded={isExpanded}
                  onViewMore={handleToggleDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </CardActions>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}
