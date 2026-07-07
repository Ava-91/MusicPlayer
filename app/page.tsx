"use client"

import { useState } from "react"

export default function Home() {
  const [first, setFirst] = useState("")

  return (
    <div>
      {first}
    </div>
  )
}