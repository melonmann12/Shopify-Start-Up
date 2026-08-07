import React from 'react'
import { getUgcItems } from '@/lib/data/ugc'
import UgcSocialProofClient from './UgcSocialProofClient'

interface Props {
  locale?: string
}

export default async function UgcSocialProof({ locale = 'en' }: Props) {
  const items = await getUgcItems(locale)
  return <UgcSocialProofClient locale={locale} items={items} />
}
