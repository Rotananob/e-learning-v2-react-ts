import { auth, db, DEFAULT_AVATAR } from "./main.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ✅ Fix #1: Allow edit Repost text
export function enableRepostEdit(postDiv, postId, post) {
  const editBtn = postDiv.querySelector(".edit-btn");
  if (!editBtn) return;

  onAuthStateChanged(auth, (u) => {
    if (u && u.uid === post.userId) {
      editBtn.style.display = "inline-flex";
    }
  });

  editBtn.onclick = async () => {
    const newText = prompt("កែប្រែ Post:", post.text || post.repostText);
    if (newText && newText.trim()) {
      await updateDoc(doc(db, "posts", postId), {
        text: post.repostFrom ? post.text : newText.trim(),
        repostText: post.repostFrom ? newText.trim() : (post.repostText || "")
      });
    }
  };
}

// ✅ Fix #2: Username above Repost text
export function renderRepostUsername(content, username, repostText) {
  const userDiv = document.createElement("div");
  userDiv.className = "repost-username";
  userDiv.textContent = username;

  if (repostText && repostText.trim() !== "") {
    const repostTextDiv = document.createElement("div");
    repostTextDiv.className = "repost-text";
    repostTextDiv.textContent = repostText;
    content.appendChild(userDiv);
    content.appendChild(repostTextDiv);
  } else {
    content.appendChild(userDiv);
  }
}

// ✅ Fix #3: Comment edit & reply (reuse logic)
export function enableCommentEdit(commentDiv, postId, cData) {
  const editCmtBtn = commentDiv.querySelector(".edit-comment-btn");
  if (!editCmtBtn) return;

  onAuthStateChanged(auth, (u) => {
    if (u && u.uid === cData.userId) {
      editCmtBtn.style.display = "inline-flex";
    }
  });

  editCmtBtn.onclick = async () => {
    const newCmt = prompt("កែប្រែ Comment:", cData.text);
    if (newCmt && newCmt.trim()) {
      await updateDoc(doc(db, `posts/${postId}/comments`, cData.id), {
        text: newCmt.trim(),
      });
    }
  };
}
