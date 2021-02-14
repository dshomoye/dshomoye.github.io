import React, { useEffect, useState } from "react"

const LikeButton = ({ pathname, hostname }) => {
  const [likes, setLikes] = useState("...")
  const [liked, setLiked] = useState(false)

  const payload = { pathname, hostname }

  useEffect(() => {
    fetch("/.netlify/functions/page-stats", {
      method: "POST",
      body: JSON.stringify({
        action: "get_likes",
        payload,
      }),
    }).then(res => {
      res.json().then(r => setLikes(r.likes))
    })
  }, [])

  const toggle = () => {
    if (!Number.isInteger(likes)) return
    if (!liked) {
      setLikes(l => l + 1)
      setLiked(true)
      fetch("/.netlify/functions/page-stats", {
        method: "POST",
        body: JSON.stringify({
          action: "add_like",
          payload,
        }),
      })
    } else {
      setLiked(false)
      setLikes(l => {
        if (l > 0) {
          return l - 1
        }
        return l
      })
      fetch("/.netlify/functions/page-stats", {
        method: "POST",
        body: JSON.stringify({
          action: "remove_like",
          payload,
        }),
      })
    }
  }

  return (
    <button
      title="Experimental: Give a thumbs up if you like the post."
      className={`like-btn ${liked && "like-btn-liked"}`}
      onClick={toggle}
    >
      <span style={{ margin: "0 0.5rem" }}>👍🏾</span> {likes}
    </button>
  )
}

export default LikeButton
