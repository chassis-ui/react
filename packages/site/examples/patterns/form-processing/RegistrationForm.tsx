import { useState } from 'react'
import {
  Button,
  Form,
  TextInput,
  FormLabel,
  Select,
  FormFeedback,
  Notification,
  Row,
  Col
} from '@chassis-ui/react'

export const Example = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const validName = name.trim().length >= 2
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validRole = role !== ''
  const validPassword = password.length >= 8
  const allValid = validName && validEmail && validRole && validPassword
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (allValid) setSuccess(true)
  }
  const handleReset = () => {
    setName('')
    setEmail('')
    setRole('')
    setPassword('')
    setSubmitted(false)
    setSuccess(false)
  }
  const roleOptions = [
    { label: 'Administrator', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' }
  ]
  return (
    <div>
      {success && (
        <Notification color="success" dismissible onClose={handleReset} className="mb-4">
          <strong>Account created!</strong> Welcome aboard, {name}.
        </Notification>
      )}
      <Form onSubmit={handleSubmit} onReset={handleReset} validated={false}>
        <Row className="mb-3">
          <Col>
            <FormLabel htmlFor="reg-name">Full name</FormLabel>
            <TextInput
              id="reg-name"
              placeholder="Jane Smith"
              value={name}
              onChange={setName}
              valid={submitted && validName}
              invalid={submitted && !validName}
            />
            <FormFeedback invalid>
              Please enter your full name (at least 2 characters).
            </FormFeedback>
          </Col>
          <Col>
            <FormLabel htmlFor="reg-email">Email address</FormLabel>
            <TextInput
              id="reg-email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={setEmail}
              valid={submitted && validEmail}
              invalid={submitted && !validEmail}
            />
            <FormFeedback invalid>Please enter a valid email address.</FormFeedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FormLabel htmlFor="reg-role">Role</FormLabel>
            <Select
              id="reg-role"
              placeholder="Select a role…"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              valid={submitted && validRole}
              invalid={submitted && !validRole}
              options={roleOptions}
            />
            <FormFeedback invalid>Please select a role.</FormFeedback>
          </Col>
          <Col>
            <FormLabel htmlFor="reg-pw">Password</FormLabel>
            <TextInput
              id="reg-pw"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={setPassword}
              valid={submitted && validPassword}
              invalid={submitted && !validPassword}
            />
            <FormFeedback invalid>Password must be at least 8 characters.</FormFeedback>
          </Col>
        </Row>
        <div className="d-flex gap-2">
          <Button type="submit" color="primary">
            Create account
          </Button>
          <Button type="reset" color="secondary" variant="outline">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  )
}
