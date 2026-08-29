import { Fragment, useState } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
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
}

interface EmployeeField {
  key: keyof Employee
  label: string
}

const SUMMARY_FIELDS: EmployeeField[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'emailId', label: 'Email ID' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'department', label: 'Department' },
]

const DETAIL_FIELDS: EmployeeField[] = [
  { key: 'country', label: 'Country' },
  { key: 'countryId', label: 'Country ID' },
  { key: 'state', label: 'State' },
  { key: 'district', label: 'District' },
]

const TABLE_COLUMN_COUNT = SUMMARY_FIELDS.length + 2

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
  const preserveCase = key === 'email' || key === 'emailId'
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

function LocationDetails({ employee }: { employee: Employee }) {
  const displayName = formatField(employee.name)

  return (
    <Box
      role="region"
      aria-label={`Location details for ${displayName}`}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 1.5,
        py: 1.5,
        px: { xs: 0, sm: 1 },
      }}
    >
      {DETAIL_FIELDS.map((field) => (
        <Typography key={field.key} variant="body2">
          <strong>{field.label}:</strong> {getFieldValue(employee, field.key)}
        </Typography>
      ))}
    </Box>
  )
}

function EmployeeActions({
  employee,
  isExpanded,
  onViewMore,
}: {
  employee: Employee
  isExpanded: boolean
  onViewMore: (employeeId: string) => void
}) {
  const displayName = formatField(employee.name)

  return (
    <>
      <Button
        size="small"
        onClick={() => onViewMore(employee.id)}
        aria-label={`View more for ${displayName}`}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'View less' : 'View more'}
      </Button>
      <IconButton aria-label={`Edit ${displayName}`} size="small">
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label={`Delete ${displayName}`} size="small" color="error">
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </>
  )
}

export function EmployeeList({ employees }: EmployeeListProps) {
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(
    null,
  )

  function handleViewMore(employeeId: string) {
    setExpandedEmployeeId((currentId) =>
      currentId === employeeId ? null : employeeId,
    )
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
            borderCollapse: 'collapse',
            '& .employee-data-row .MuiTableCell-root': {
              px: 1,
              py: 0.75,
              ...tableBorder,
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              px: 1,
              py: 0.75,
              ...tableBorder,
              bgcolor: 'grey.50',
              fontWeight: 600,
            },
            '& .employee-details-row .MuiTableCell-root': {
              px: 1,
              py: 0,
              border: 'none',
            },
          }}
        >
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
            {employees.map((employee) => {
              const isExpanded = expandedEmployeeId === employee.id

              return (
                <Fragment key={employee.id}>
                  <TableRow className="employee-data-row" hover>
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
                        onViewMore={handleViewMore}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className="employee-details-row"
                    sx={{ display: isExpanded ? 'table-row' : 'none' }}
                  >
                    <TableCell
                      colSpan={TABLE_COLUMN_COUNT}
                      sx={{
                        py: 0,
                        borderBottom: tableBorder.border,
                        borderColor: 'grey.300',
                      }}
                    >
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <LocationDetails employee={employee} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              )
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
              sx={{ borderColor: 'grey.300' }}
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
                      <strong>{field.label}:</strong>{' '}
                      {getFieldValue(employee, field.key)}
                    </Typography>
                  ))}
                </Box>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <LocationDetails employee={employee} />
                </Collapse>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <EmployeeActions
                  employee={employee}
                  isExpanded={isExpanded}
                  onViewMore={handleViewMore}
                />
              </CardActions>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}
