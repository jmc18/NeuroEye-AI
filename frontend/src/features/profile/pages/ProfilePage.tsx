import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { PageHeader } from '@components/layout'
import { Button, Card } from '@components/ui'
import {
  changeMyEmail,
  changeMyPassword,
  requestPasswordReset,
  updateMyProfile,
} from '@features/auth/services/authService'
import { useAuth } from '@hooks/useStore'
import { toast } from '@shared/notifications'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { user, applySession, setUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [emailPassword, setEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)

  if (!user) {
    return null
  }

  const roleKey = user.role as 'researcher' | 'clinician' | 'super_admin'
  const roleLabel = ['researcher', 'clinician', 'super_admin'].includes(user.role)
    ? t(`app.profile.roles.${roleKey}`)
    : user.role

  const onSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingProfile(true)
    try {
      const updated = await updateMyProfile({
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle || null,
        phone_number: phoneNumber || null,
      })
      setUser(updated)
      toast.success(t('app.profile.saved'))
    } catch {
      // Axios interceptor already toasts API errors.
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangeEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingEmail(true)
    const session = await changeMyEmail({
      current_password: emailPassword,
      email,
    })
    setSavingEmail(false)
    if (!session) {
      return
    }
    applySession(session)
    setEmailPassword('')
    toast.success(t('app.profile.emailUpdated'))
  }

  const onChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingPassword(true)
    const ok = await changeMyPassword({
      current_password: currentPassword,
      new_password: newPassword,
    })
    setSavingPassword(false)
    if (!ok) {
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    toast.success(t('app.profile.passwordUpdated'))
  }

  const onRequestReset = async () => {
    setSendingReset(true)
    const ok = await requestPasswordReset(user.email)
    setSendingReset(false)
    if (ok) {
      toast.success(t('app.profile.resetRequested'))
    }
  }

  return (
    <div>
      <PageHeader title={t('app.profile.title')} description={t('app.profile.description')} />

      <div className="grid max-w-4xl gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="font-semibold text-on-surface">{user.name}</p>
              <p className="font-data-mono text-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('app.profile.role')}</dt>
              <dd className="font-medium text-on-surface">{roleLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('app.profile.tenant')}</dt>
              <dd className="font-medium text-on-surface">{user.tenant}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-on-surface">{t('app.profile.identity')}</h2>
          <form className="space-y-4" onSubmit={onSaveProfile}>
            <FormField id="first_name" label={t('app.profile.firstName')}>
              <input
                id="first_name"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={formControlClassName()}
              />
            </FormField>
            <FormField id="last_name" label={t('app.profile.lastName')}>
              <input
                id="last_name"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={formControlClassName()}
              />
            </FormField>
            <FormField id="job_title" label={t('app.profile.jobTitle')}>
              <input
                id="job_title"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                className={formControlClassName()}
              />
            </FormField>
            <FormField id="phone_number" label={t('app.profile.phone')}>
              <input
                id="phone_number"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className={formControlClassName()}
              />
            </FormField>
            <Button type="submit" disabled={savingProfile}>
              {t('common.save')}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-on-surface">{t('app.profile.changeEmail')}</h2>
          <form className="space-y-4" onSubmit={onChangeEmail}>
            <FormField id="new_email" label={t('common.email')}>
              <input
                id="new_email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={formControlClassName()}
              />
            </FormField>
            <FormField id="email_password" label={t('app.profile.currentPassword')}>
              <PasswordInput
                id="email_password"
                required
                value={emailPassword}
                onChange={(event) => setEmailPassword(event.target.value)}
              />
            </FormField>
            <Button type="submit" disabled={savingEmail}>
              {t('app.profile.updateEmail')}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-on-surface">{t('app.profile.security')}</h2>
          <form className="space-y-4" onSubmit={onChangePassword}>
            <FormField id="current_password" label={t('app.profile.currentPassword')}>
              <PasswordInput
                id="current_password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </FormField>
            <FormField id="new_password" label={t('app.profile.newPassword')}>
              <PasswordInput
                id="new_password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={savingPassword}>
                {t('app.profile.updatePassword')}
              </Button>
              <Button variant="secondary" disabled={sendingReset} onClick={() => void onRequestReset()}>
                {t('app.profile.requestReset')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
