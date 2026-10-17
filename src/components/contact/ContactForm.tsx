import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLocale } from '../../i18n/useLocale.ts'
import { submitContact } from '../../utils/submitContact.ts'
import { validateContact } from '../../utils/validateContact.ts'
import type { ContactErrors, ContactValues } from '../../utils/validateContact.ts'
import { ContactField } from './ContactField.tsx'
import { TurnstileWidget } from './TurnstileWidget.tsx'

type Status = 'idle' | 'invalid' | 'submitting' | 'success' | 'failure'

const emptyValues: ContactValues = { name: '', email: '', message: '' }
const fieldOrder = ['name', 'email', 'message'] as const

export function ContactForm() {
  const { t } = useLocale()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [token, setToken] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)

    const firstInvalid = fieldOrder.find((field) => found[field])
    if (firstInvalid) {
      setStatus('invalid')
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (!token) {
      setStatus('failure')
      return
    }

    setStatus('submitting')
    try {
      await submitContact(values, token)
      setValues(emptyValues)
      setStatus('success')
    } catch (error) {
      console.error('Contact submit failed', error)
      setStatus('failure')
    } finally {
      setToken('')
      setWidgetKey((key) => key + 1)
    }
  }

  const errorText = (field: keyof ContactValues) => {
    const key = errors[field]
    return key ? t.contact.errors[key] : undefined
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-4">
      <ContactField
        name="name"
        label={t.contact.fields.name}
        value={values.name}
        error={errorText('name')}
        autoComplete="name"
        onChange={handleChange}
      />
      <ContactField
        name="email"
        label={t.contact.fields.email}
        type="email"
        value={values.email}
        error={errorText('email')}
        autoComplete="email"
        onChange={handleChange}
      />
      <ContactField
        name="message"
        label={t.contact.fields.message}
        value={values.message}
        error={errorText('message')}
        multiline
        onChange={handleChange}
      />
      <TurnstileWidget key={widgetKey} onToken={setToken} />
      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        >
          {status === 'submitting' ? t.contact.submitting : t.contact.submit}
        </button>
      </div>
      {status === 'success' && <p role="status">{t.contact.success}</p>}
      {status === 'failure' && (
        <p role="alert" className="text-red-700">
          {t.contact.failure}
        </p>
      )}
    </form>
  )
}
