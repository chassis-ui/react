import React from 'react'
import {
  CxCard,
  CxCardBody,
  CxCardTitle,
  CxBadge,
  CxList,
  CxProgress,
  CxProgressBar,
  CxTable,
  CxRow,
  CxCol
} from '@chassis-ui/react'

export const Dashboard = () => {
  const stats = [
    { label: 'Total Users', value: '12,540', delta: '+8%', context: 'primary' },
    { label: 'Active Sessions', value: '342', delta: '+12%', context: 'success' },
    { label: 'Open Issues', value: '27', delta: '-3%', context: 'warning' },
    { label: 'Server Errors', value: '4', delta: '+1', context: 'danger' }
  ]
  const orders = [
    { id: '#1042', customer: 'Alice Martin', amount: '$120.00', status: 'Paid' },
    { id: '#1043', customer: 'Bob Chen', amount: '$85.50', status: 'Pending' },
    { id: '#1044', customer: 'Carol White', amount: '$240.00', status: 'Paid' },
    { id: '#1045', customer: 'David Kim', amount: '$59.99', status: 'Failed' }
  ]
  const orderStatusCtx = { Paid: 'success', Pending: 'warning', Failed: 'danger' }
  const activity = [
    { label: 'New user registered — Alice Martin', href: '#' },
    { label: 'Order #1045 failed payment', href: '#' },
    { label: 'Server backup completed', href: '#' },
    { label: 'Password reset requested', href: '#' }
  ]
  const traffic = [
    { label: 'Organic Search', value: 52, context: 'primary' },
    { label: 'Direct', value: 24, context: 'success' },
    { label: 'Referral', value: 14, context: 'info' },
    { label: 'Social', value: 10, context: 'warning' }
  ]
  const orderColumns = [
    { key: 'id', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <CxBadge context={orderStatusCtx[v]}>{v}</CxBadge>
    }
  ]
  return (
    <div>
      <CxRow className="mb-xlarge">
        {stats.map((stat) => (
          <CxCol key={stat.label}>
            <CxCard>
              <CxCardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="small fg-neutral mb-xsmall">{stat.label}</div>
                    <div className="h4 mb-0">{stat.value}</div>
                  </div>
                  <CxBadge context={stat.context}>{stat.delta}</CxBadge>
                </div>
              </CxCardBody>
            </CxCard>
          </CxCol>
        ))}
      </CxRow>
      <CxRow className="mb-xlarge">
        <CxCol>
          <CxCard>
            <CxCardBody>
              <h5 className="mb-medium">Recent Orders</h5>
              <CxTable hover columns={orderColumns} items={orders} />
            </CxCardBody>
          </CxCard>
        </CxCol>
      </CxRow>
      <CxRow>
        <CxCol>
          <CxCard>
            <CxCardBody>
              <h5 className="mb-medium">Recent Activity</h5>
              <CxList flush items={activity} />
            </CxCardBody>
          </CxCard>
        </CxCol>
        <CxCol>
          <CxCard>
            <CxCardBody>
              <h5 className="mb-medium">Traffic Sources</h5>
              {traffic.map((src) => (
                <div key={src.label} className="mb-medium">
                  <div className="d-flex justify-content-between mb-xsmall">
                    <small>{src.label}</small>
                    <small>{src.value}%</small>
                  </div>
                  <CxProgress>
                    <CxProgressBar context={src.context} value={src.value} max={100} />
                  </CxProgress>
                </div>
              ))}
            </CxCardBody>
          </CxCard>
        </CxCol>
      </CxRow>
    </div>
  )
}
