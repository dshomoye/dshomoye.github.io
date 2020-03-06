import React, { useEffect, useState } from "react"

const QuoteBlock = () => {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const getQuote = async () => {
      try {
        const quoteResponse = await fetch(
          "https://quote-garden.herokuapp.com/quotes/random"
        )
        const quoteData = await quoteResponse.json()
        setQuote({
          author: quoteData.quoteAuthor,
          text: quoteData.quoteText,
        })
      } catch (e) {
        console.log("Unable to fetch quote from api ", e)
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
