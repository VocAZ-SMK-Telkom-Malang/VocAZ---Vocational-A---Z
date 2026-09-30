// app/register/school/[step]/page.tsx
import { notFound } from 'next/navigation'
import { Step1Plan } from '../_components/step-1-plan'
import { Step2Payment } from '../_components/step-2-payment'
import { Step3Account } from '../_components/step-3-account'
import { Step4School } from '../_components/step-4-school'
import { Step5Done } from '../_components/step-5-done'

type Props = {
  params: Promise<{ step: string }>
}

export default async function SchoolRegisterStepPage({ params }: Props) {
  const { step } = await params

  switch (step) {
    case '1':
      return <Step1Plan />
    case '2':
      return <Step2Payment />
    case '3':
      return <Step3Account />
    case '4':
      return <Step4School />
    case '5':
      return <Step5Done />
    default:
      notFound()
  }
}