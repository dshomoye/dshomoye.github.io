import React, { useEffect, useState } from "react"

const LikeButton = ({pathname, hostname}) => {
  const [likes, setLikes] = useState("...")
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetch("/.netlify/functions/page-stats", {
      method: "POST",
      body: JSON.stringify({
        action: "get_likes",
        payload: {
          pathname,
          hostname
        }
      })
    }).then(res => {
      res.json().then((r) => setLikes(r.likes))
    })
  }, [])

  const toggle = () => {
    if(!Number.isInteger(likes)) return
    if(!liked){
      setLikes(l => l + 1);
      setLiked(true)
      fetch("/.netlify/functions/page-stats", {
        method: "POST",
        body: JSON.stringify({
          action: "add_like",
          payload: {
            pathname,
            hostname
          }
        })
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
          payload: {
            pathname,
            hostname
          }
        })
      })
    }
  }

  return <button className={`like-btn ${liked && 'like-btn-liked'}`} onClick={toggle}> {likes} | 👏🏾 </button>
}

export default LikeButton
