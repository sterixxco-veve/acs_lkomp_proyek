import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Computer as ComputerIcon,
  TrendingUp as TrendingUpIcon,
  Build as BuildIcon
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts'

const stats = [
  { label: 'Total PC', value: 225, icon: <ComputerIcon color="primary" />, color: 'primary.main' },
  {
    label: 'Usable PC',
    value: 198,
    percent: '88%',
    icon: <TrendingUpIcon color="success" />,
    color: 'success.main'
  },
  {
    label: 'Broken PC',
    value: 18,
    percent: '8%',
    icon: <TrendingUpIcon color="success" />,
    color: 'error.main'
  },
  {
    label: 'Maintenance Active',
    value: 9,
    icon: <BuildIcon sx={{ color: '#f57c00' }} />,
    color: '#f57c00'
  },
  {
    label: 'Low Stock Components',
    value: 12,
    icon: <div style={{ color: '#fbc02d', fontWeight: 'bold' }}>📦</div>,
    color: '#fbc02d'
  }
]

const healthData = [
  { name: 'Lab E4', value: 75 },
  { name: 'Lab L4', value: 70 },
  { name: 'Lab L3', value: 60 }
]

const trendData = [
  { month: 'Jan', value: 12 },
  { month: 'Feb', value: 15 },
  { month: 'Mar', value: 18 },
  { month: 'Apr', value: 14 },
  { month: 'May', value: 23 },
  { month: 'Jun', value: 19 }
]

const replacedData = [
  { name: 'RAM DDR4 8GB', value: 45, fill: '#5c7cfa' },
  { name: 'HDD 500GB', value: 38, fill: '#40c057' },
  { name: 'PSU 500W', value: 32, fill: '#fa5252' },
  { name: 'Motherboard', value: 28, fill: '#fab005' },
  { name: 'CPU Fan', value: 24, fill: '#339af0' }
]

const maintenanceLogs = [
  {
    id: 'MNT-2026-0147',
    pc: 'E4-PC-042',
    issue: 'RAM rusak, tidak detect',
    component: 'RAM DDR4 8GB (1 unit)',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    id: 'MNT-2026-0146',
    pc: 'L4-PC-015',
    issue: 'HDD bad sector',
    component: 'SSD 256GB (1 unit)',
    status: 'In Progress',
    statusColor: 'error'
  },
  {
    id: 'MNT-2026-0145',
    pc: 'L3-PC-028',
    issue: 'PSU mati total',
    component: 'PSU 600W (1 unit)',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    id: 'MNT-2026-0144',
    pc: 'E4-PC-067',
    issue: 'Motherboard tidak booting',
    component: 'Motherboard H510 (1 unit)',
    status: 'Completed',
    statusColor: 'success'
  }
]

export const LabHealthDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f8f9fa', minHeight: '100vh', borderRadius: '16px' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring laboratorium komputer kampus
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          🕒 Last updated: 20.57.52
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: `${stat.color}15`,
                      display: 'inline-flex'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  {stat.percent && (
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.percent}
                    </Typography>
                  )}
                </Box>
                <Typography color="text.secondary" variant="body2">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color, mt: 1 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                Health Status per Lab
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Bar dataKey="value" fill="#f59e0b" barSize={40} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                Maintenance Trend (6 Months)
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                Most Replaced Components
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={replacedData}
                    margin={{ top: 10, right: 10, left: 100, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                      {replacedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                Recent Maintenance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>PC Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Issue</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maintenanceLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.pc}
                            size="small"
                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>{log.issue}</TableCell>
                        <TableCell>{log.component}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.status}
                            size="small"
                            color={log.statusColor}
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
