import { notFound } from 'next/navigation'
import { Step1Account } from '../_components/step-1-account'
import { Step2Data } from '../_components/step-2-data'
import { Step3Verification } from '../_components/step-3-verification'
import { Step4Done } from '../_components/step-4-done'

type Props = {
  params: Promise<{ step: string }>
}

export default async function CompanyRegisterStepPage({ params }: Props) {
  const { step } = await params

  switch (step) {
    case '1':
      return <Step1Account />
    case '2':
      return <Step2Data />
    case '3':
      return <Step3Verification />
    case '4':
      return <Step4Done />
    default:
      notFound()
  }
}