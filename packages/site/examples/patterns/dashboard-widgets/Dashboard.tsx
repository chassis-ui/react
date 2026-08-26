import {
  Card,
  CardBody,
  Badge,
  List,
  Progress,
  ProgressBar,
  Table,
  Row,
  Col,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@chassis-ui/react'

export const Example = () => {
  const stats = [
    { label: 'Total Users', value: '12,540', delta: '+8%', color: 'primary' },
    { label: 'Active Sessions', value: '342', delta: '+12%', color: 'success' },
    { label: 'Open Issues', value: '27', delta: '-3%', color: 'warning' },
    { label: 'Server Errors', value: '4', delta: '+1', color: 'danger' }
  ] as const
  const orders = [
    { id: '#1042', customer: 'Alice Martin', amount: '$120.00', status: 'Paid' },
    { id: '#1043', customer: 'Bob Chen', amount: '$85.50', status: 'Pending' },
    { id: '#1044', customer: 'Carol White', amount: '$240.00', status: 'Paid' },
    { id: '#1045', customer: 'David Kim', amount: '$59.99', status: 'Failed' }
  ]
  const orderStatusColor = { Paid: 'success', Pending: 'warning', Failed: 'danger' } as const
  const activity = [
    { label: 'New user registered — Alice Martin', href: '#' },
    { label: 'Order #1045 failed payment', href: '#' },
    { label: 'Server backup completed', href: '#' },
    { label: 'Password reset requested', href: '#' }
  ]
  const traffic = [
    { label: 'Organic Search', value: 52, color: 'primary' },
    { label: 'Direct', value: 24, color: 'success' },
    { label: 'Referral', value: 14, color: 'info' },
    { label: 'Social', value: 10, color: 'warning' }
  ] as const
  const orderColumns = [
    { key: 'id', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (v: string) => (
        <Badge color={orderStatusColor[v as keyof typeof orderStatusColor]}>{v}</Badge>
      )
    }
  ]
  return (
    <div>
      <Row className="mb-xlarge">
        {stats.map((stat) => (
          <Col key={stat.label}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="small fg-neutral mb-xsmall">{stat.label}</div>
                    <div className="h4 mb-0">{stat.value}</div>
                  </div>
                  <Badge color={stat.color}>{stat.delta}</Badge>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-xlarge">
        <Col>
          <Card>
            <CardBody>
              <h5 className="mb-medium">Recent Orders</h5>
              <Table aria-label="Recent orders" hover>
                <TableHeader columns={orderColumns}>
                  {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={orders}>
                  {(row) => (
                    <TableRow key={row.id}>
                      {(columnKey) => {
                        const column = orderColumns.find((c) => c.key === columnKey)
                        const value = row[columnKey as keyof typeof row]
                        return (
                          <TableCell>
                            {column?.render ? column.render(String(value)) : value}
                          </TableCell>
                        )
                      }}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h5 className="mb-medium">Recent Activity</h5>
              <List plain items={activity} />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <h5 className="mb-medium">Traffic Sources</h5>
              {traffic.map((src) => (
                <div key={src.label} className="mb-medium">
                  <div className="d-flex justify-content-between mb-xsmall">
                    <small>{src.label}</small>
                    <small>{src.value}%</small>
                  </div>
                  <Progress color={src.color} value={src.value} />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
