import { useState } from 'react'
import {
  CxButton,
  CxForm,
  CxFormInput,
  CxFormLabel,
  CxFormSelect,
  CxFormFeedback,
  CxNotification,
  CxRow,
  CxCol
} from '@chassis-ui/react'

export const RegistrationForm = () => {
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
        <CxNotification context="success" dismissible onClose={handleReset} className="mb-4">
          <strong>Account created!</strong> Welcome aboard, {name}.
        </CxNotification>
      )}
      <CxForm onSubmit={handleSubmit} onReset={handleReset} validated={false}>
        <CxRow className="mb-3">
          <CxCol>
            <CxFormLabel htmlFor="reg-name">Full name</CxFormLabel>
            <CxFormInput
              id="reg-name"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              valid={submitted && validName}
              invalid={submitted && !validName}
            />
            <CxFormFeedback invalid>
              Please enter your full name (at least 2 characters).
            </CxFormFeedback>
          </CxCol>
          <CxCol>
            <CxFormLabel htmlFor="reg-email">Email address</CxFormLabel>
            <CxFormInput
              id="reg-email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              valid={submitted && validEmail}
              invalid={submitted && !validEmail}
            />
            <CxFormFeedback invalid>Please enter a valid email address.</CxFormFeedback>
          </CxCol>
        </CxRow>
        <CxRow className="mb-3">
          <CxCol>
            <CxFormLabel htmlFor="reg-role">Role</CxFormLabel>
            <CxFormSelect
              id="reg-role"
              placeholder="Select a role…"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              valid={submitted && validRole}
              invalid={submitted && !validRole}
              options={roleOptions}
            />
            <CxFormFeedback invalid>Please select a role.</CxFormFeedback>
          </CxCol>
          <CxCol>
            <CxFormLabel htmlFor="reg-pw">Password</CxFormLabel>
            <CxFormInput
              id="reg-pw"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              valid={submitted && validPassword}
              invalid={submitted && !validPassword}
            />
            <CxFormFeedback invalid>Password must be at least 8 characters.</CxFormFeedback>
          </CxCol>
        </CxRow>
        <div className="d-flex gap-2">
          <CxButton type="submit" context="primary">
            Create account
          </CxButton>
          <CxButton type="reset" context="secondary" variant="outline">
            Reset
          </CxButton>
        </div>
      </CxForm>
    </div>
  )
}
