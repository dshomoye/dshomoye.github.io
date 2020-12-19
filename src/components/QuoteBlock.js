import React, { useEffect, useState } from "react"

const QuoteBlock = () => {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const getQuote = async () => {
      try {
        const quoteResponse = await fetch(
          "https://api.quotable.io/random"
        )
        const quoteData = await quoteResponse.json()
        setQuote({
          author: quoteData.author,
          text: quoteData.content,
        })
      } catch (e) {
        //NOOP
      }
    }
    getQuote()
  }, [])

  if (!quote) return null
  return (
    <>
      <hr />
      <p style={{ fontSize: "small" }}>
        {" "}
        <strong> {quote.author}: </strong> {quote.text}
      </p>
    </>
  )
}

export default QuoteBlock
