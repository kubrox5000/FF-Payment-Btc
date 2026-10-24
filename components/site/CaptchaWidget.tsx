'use client'

import { Turnstile } from '@marsidev/react-turnstile'

interface CaptchaWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export function CaptchaWidget({ onVerify, onExpire }: CaptchaWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onVerify}
        onExpire={onExpire}
        options={{
          language: 'auto',
          theme: 'dark',
          size: 'normal',
        }}
      />
    </div>
  )
}
