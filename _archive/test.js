
const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
onSnapshot(postsQuery, (snapshot) => {
  chatMessages.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const postId = docSnap.id;

    const postDiv = document.createElement("div");
    postDiv.className = "chat-message";
    postDiv.setAttribute("data-post-id", postId);

    const avatar = DEFAULT_AVATAR;
    const username = post.user || (post.userId ? post.userId : "user");
    const timeStr = formatTimestamp(post.createdAt);

    // Avatar
    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    avatarImg.className = "chat-avatar";
    avatarImg.alt = username + " avatar";

    // Content
    const content = document.createElement("div");
    content.className = "chat-content";

    const header = document.createElement("div");
    header.className = "chat-header";

    const leftHeader = document.createElement("div");
    leftHeader.className = "chat-user-left";

    const userSpan = document.createElement("span");
    userSpan.className = "chat-username";
    userSpan.textContent = username;

    const timeSpan = document.createElement("span");
    timeSpan.className = "timestamp";
    timeSpan.textContent = timeStr;

    leftHeader.appendChild(userSpan);
    leftHeader.appendChild(timeSpan);
    header.appendChild(leftHeader);
    content.appendChild(header);

    // Post text
    const textDiv = document.createElement("div");
    textDiv.className = "chat-text";
    textDiv.textContent = post.text || "";
    content.appendChild(textDiv);

    // Actions
    const actions = document.createElement("div");
    actions.className = "card-actions";

    // ❤️ Love
    const loveBtn = document.createElement("button");
    loveBtn.className = "action-btn love-btn";
    loveBtn.title = "Love";
    const heart = document.createElement("i");
    heart.className = "fa fa-heart";
    heart.style.color = "red";
    const loveCnt = document.createElement("span");
    loveCnt.className = "count";
    loveCnt.textContent = Array.isArray(post.loves) ? post.loves.length : 0;
    loveBtn.appendChild(heart);
    loveBtn.appendChild(loveCnt);

    // 😮 Wow
    const wowBtn = document.createElement("button");
    wowBtn.className = "action-btn wow-btn";
    wowBtn.title = "Wow";
    const wowIcon = document.createElement("i");
    wowIcon.className = "fa-solid fa-face-surprise";
    const wowCnt = document.createElement("span");
    wowCnt.className = "count";
    wowCnt.textContent = Array.isArray(post.wows) ? post.wows.length : 0;
    wowBtn.appendChild(wowIcon);
    wowBtn.appendChild(wowCnt);

    // 😆 Haha
    const hahaBtn = document.createElement("button");
    hahaBtn.className = "action-btn haha-btn";
    hahaBtn.title = "Haha";
    const hahaIcon = document.createElement("i");
    hahaIcon.className = "fa-solid fa-face-laugh";
    const hahaCnt = document.createElement("span");
    hahaCnt.className = "count";
    hahaCnt.textContent = Array.isArray(post.hahas) ? post.hahas.length : 0;
    hahaBtn.appendChild(hahaIcon);
    hahaBtn.appendChild(hahaCnt);

    // Share
    const shareBtn = document.createElement("button");
    shareBtn.className = "action-btn share-btn";
    shareBtn.innerHTML = "🔗 <span>Share</span>";

    // Pin
    const pinBtn = document.createElement("button");
    pinBtn.className = "action-btn pin-btn";
    pinBtn.textContent = post.pinned ? "📌 Pinned" : "📌 Pin";

    // Edit Post
    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit-btn";
    editBtn.innerHTML = '<i class="fa fa-edit"></i> Edit';
    editBtn.style.display = "none";

    actions.appendChild(loveBtn);
    actions.appendChild(wowBtn);
    actions.appendChild(hahaBtn);
    actions.appendChild(shareBtn);
    actions.appendChild(pinBtn);
    actions.appendChild(editBtn);
    content.appendChild(actions);

    // Comment Section
    const commentBox = document.createElement("div");
    commentBox.className = "comment-box";
    const commentList = document.createElement("div");
    commentList.className = "comment-list";
    commentBox.appendChild(commentList);

    const commentInputDiv = document.createElement("div");
    commentInputDiv.className = "comment-input";
    const commentInput = document.createElement("input");
    commentInput.placeholder = "សរសេរ comment...";
    const commentBtn = document.createElement("button");
    commentBtn.textContent = "💬 Cmt";
    commentInputDiv.appendChild(commentInput);
    commentInputDiv.appendChild(commentBtn);
    commentBox.appendChild(commentInputDiv);

    postDiv.appendChild(avatarImg);
    postDiv.appendChild(content);
    postDiv.appendChild(commentBox);
    chatMessages.appendChild(postDiv);

    // Function setReaction (Single only)
    async function setReaction(type) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        loves: arrayRemove(auth.currentUser.uid),
        wows: arrayRemove(auth.currentUser.uid),
        hahas: arrayRemove(auth.currentUser.uid),
      });
      if (type === "love") await updateDoc(postRef, { loves: arrayUnion(auth.currentUser.uid) });
      if (type === "wow") await updateDoc(postRef, { wows: arrayUnion(auth.currentUser.uid) });
      if (type === "haha") await updateDoc(postRef, { hahas: arrayUnion(auth.currentUser.uid) });
    }

    // 🔑 Auth controls
    onAuthStateChanged(auth, (u) => {
      if (!u) return;

      // Show edit button only for owner
      if (post.userId === u.uid) editBtn.style.display = "inline-flex";

      // Reaction click
      loveBtn.onclick = () => setReaction("love");
      wowBtn.onclick = () => setReaction("wow");
      hahaBtn.onclick = () => {
        hahaBtn.classList.add("animate-haha");
        setTimeout(() => hahaBtn.classList.remove("animate-haha"), 600);
        setReaction("haha");
      };

      // Pin
      pinBtn.onclick = async () => {
        const currentPinned = post.pinned || false;
        await updateDoc(doc(db, "posts", postId), { pinned: !currentPinned });
      };

      // Edit
      editBtn.onclick = async () => {
        const newText = prompt("កែប្រែ Post:", post.text);
        if (newText && newText.trim()) {
          await updateDoc(doc(db, "posts", postId), { text: newText.trim() });
        }
      };
    });

    // Share
    shareBtn.onclick = async () => {
      const shareUrl = `${window.location.origin}/post/${postId}`;
      const title = `${username} នៅលើ Rotana NOB`;
      const text = post.text ? (post.text.length > 120 ? post.text.slice(0, 120) + "..." : post.text) : title;
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url: shareUrl });
        } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("URL បានចម្លងទៅ clipboard ✅");
        } catch (e) {
          prompt("ចម្លង link:", shareUrl);
        }
      }
    };

  // ⭐ Comments listener (Fixed like Facebook but without last comment)
const commentsQuery = query(collection(db, `posts/${postId}/comments`), orderBy("createdAt", "asc"));
onSnapshot(commentsQuery, (commentSnap) => {
  commentList.innerHTML = "";

  const commentsArr = [];
  commentSnap.forEach((c) => commentsArr.push({ id: c.id, ...c.data() }));

  // ✅ Logic បង្ហាញតែ comment ទី១ និងទី២
  let displayComments = [];
  if (commentsArr.length <= 2) {
    displayComments = commentsArr;
  } else {
    displayComments = [commentsArr[0], commentsArr[1]];
  }

  // Render function
  const renderComment = (cData) => {
    const cDiv = document.createElement("div");
    cDiv.className = "comment";

    const cAvatar = document.createElement("img");
    cAvatar.className = "comment-avatar";
    cAvatar.src = cData.avatar || DEFAULT_AVATAR;

    const cBody = document.createElement("div");
    cBody.className = "comment-body";

    const cHeader = document.createElement("div");
    const cUser = document.createElement("span");
    cUser.className = "comment-username";
    cUser.textContent = cData.user || "user";

    const cTime = document.createElement("span");
    cTime.className = "timestamp";
    cTime.textContent = formatTimestamp(cData.createdAt);

    const cText = document.createElement("div");
    cText.className = "comment-text";
    cText.textContent = cData.text || "";

    // 👉 Reply button
    const replyBtn = document.createElement("button");
    replyBtn.className = "reply-btn";
    replyBtn.textContent = "↩️ Reply";

    // 👉 Reply list
    const replyList = document.createElement("div");
    replyList.className = "reply-list";

    // 👉 Reply input (hidden by default)
    const replyInputDiv = document.createElement("div");
    replyInputDiv.className = "reply-input";
    replyInputDiv.style.display = "none";
    const replyInput = document.createElement("input");
    replyInput.placeholder = "សរសេរ reply...";
    const replySend = document.createElement("button");
    replySend.textContent = "Reply";
    replyInputDiv.appendChild(replyInput);
    replyInputDiv.appendChild(replySend);

    // toggle reply input
    replyBtn.onclick = () => {
      replyInputDiv.style.display = replyInputDiv.style.display === "none" ? "flex" : "none";
    };

    // 🔥 Save reply (FIXED)
replySend.onclick = async () => {
  const text = replyInput.value.trim();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("សូម Login មុន");
      return;
    }
    if (!text) return;

    try {
      await addDoc(collection(db, `posts/${postId}/comments/${cData.id}/replies`), {
        text,
        user: user.displayName || (user.email || "").split("@")[0],
        avatar: DEFAULT_AVATAR,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      replyInput.value = "";
    } catch (err) {
      console.error("Reply error:", err);
      alert("❌ មានបញ្ហាក្នុងការ Reply cmt");
    }
  });
};


    // 📡 Listen replies
    const repliesQuery = query(
      collection(db, `posts/${postId}/comments/${cData.id}/replies`),
      orderBy("createdAt", "asc")
    );
    onSnapshot(repliesQuery, (replySnap) => {
      replyList.innerHTML = "";
      replySnap.forEach((r) => {
        const rData = r.data();
        const rDiv = document.createElement("div");
        rDiv.className = "reply";

        const rUser = document.createElement("span");
        rUser.className = "reply-username";
        rUser.textContent = rData.user || "user";

        const rText = document.createElement("span");
        rText.className = "reply-text";
        rText.textContent = rData.text || "";

        rDiv.appendChild(rUser);
        rDiv.appendChild(rText);
        replyList.appendChild(rDiv);
      });
    });

    cHeader.appendChild(cUser);
    cHeader.appendChild(cTime);
    cBody.appendChild(cHeader);
    cBody.appendChild(cText);
    cBody.appendChild(replyBtn);
    cBody.appendChild(replyList);
    cBody.appendChild(replyInputDiv);

    cDiv.appendChild(cAvatar);
    cDiv.appendChild(cBody);
    commentList.appendChild(cDiv);
  };

  displayComments.forEach(renderComment);

  // See all button
  if (commentsArr.length > 2) {
    const seeMoreBtn = document.createElement("button");
    seeMoreBtn.className = "action-btn";
    seeMoreBtn.textContent = `See all ${commentsArr.length} comments`;
    seeMoreBtn.onclick = () => {
      commentList.innerHTML = "";
      commentsArr.forEach(renderComment);
    };
    commentList.appendChild(seeMoreBtn);
  }
});


    // Add Comment
    commentBtn.addEventListener("click", async () => {
      const text = commentInput.value.trim();
      const user = auth.currentUser;
      if (!user) return alert("សូម Login មុន");
      if (!text) return;
      await addDoc(collection(db, `posts/${postId}/comments`), {
        text,
        user: user.displayName || (user.email || "").split("@")[0],
        avatar: DEFAULT_AVATAR,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      commentInput.value = "";
    });
  });
});
