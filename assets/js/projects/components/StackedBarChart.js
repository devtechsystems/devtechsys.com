import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function({ data, colorPalette }) {
  return (
    <BarChart width={400} height={200} data={data}>
      <XAxis dataKey='region' />
      <YAxis dataKey='value' />
      <Legend />
      <Bar dataKey='' stackId='stacked' />
      <Bar dataKey='' stackId='stacked' />
      <Bar dataKey='' stackId='stacked' />
      <Bar dataKey='' stackId='stacked' />
    </BarChart>
  )
}
