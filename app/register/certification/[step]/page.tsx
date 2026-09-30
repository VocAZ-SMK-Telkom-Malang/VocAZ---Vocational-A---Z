// app/register/certification/[step]/page.tsx
import { notFound } from 'next/navigation'
import { Step1Type } from '../_components/step-1-type'
import { Step2Account } from '../_components/step-2-account'
import { Step3Institution } from '../_components/step-3-institution'
import { Step4Done } from '../_components/step-4-done'

type Props = {
  params: Promise<{ step: string }>
}

export default async function CertificationRegisterStepPage({
  params,
}: Props) {
  const { step } = await params

  switch (step) {
    case '1':
      return <Step1Type />
    case '2':
      return <Step2Account />
    case '3':
      return <Step3Institution />
    case '4':
      return <Step4Done />
    default:
      notFound()
  }
}