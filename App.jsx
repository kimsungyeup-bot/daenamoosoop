import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "전체", emoji: "🎋" },
  { id: "work", label: "직장", emoji: "💼" },
  { id: "love", label: "연애", emoji: "💔" },
  { id: "family", label: "가족", emoji: "🏠" },
  { id: "money", label: "돈", emoji: "💸" },
  { id: "just", label: "그냥 화남", emoji: "😤" },
];

const REACTIONS = [
  { id: "same", label: "나도ㅠ", emoji: "😭" },
  { id: "lol", label: "ㅋㅋㅋ", emoji: "😂" },
  { id: "cheer", label: "힘내", emoji: "🔥" },
  { id: "wow", label: "헐", emoji: "😱" },
];

// 정령 답변 풀 - 글 올리면 여기서 랜덤 매칭
const SPIRIT_POOL = {
  work: [
    "퇴근 5분 전 업무는 사실 법으로 금지해야 한다고 생각해요 🎋",
    "그 팀장, 퇴근 개념이 없는 게 아니라 당신 시간 개념이 없는 거예요 😤",
    "야근수당은 꼬박꼬박 챙기세요, 그게 유일한 복수 🔥",
    "내일 딱 칼퇴 한 번 해보세요. 세상 안 끝나요 🎋",
    "이직 준비하는 게 가장 현명한 야근이에요 💼",
  ],
  love: [
    "3년이면 최소 전화 통화는 해줘야죠... 문자라니 🎋",
    "그 문자 캡처해두세요. 나중에 웃기거든요 😂",
    "당신 잘못이 아니에요. 그 사람이 그냥 용기가 없었던 거예요 🎋",
    "더 좋은 사람 만날 자격 있어요. 진심으로 😭",
    "지금은 너무 아프겠지만, 이게 끝이 아니에요 🔥",
  ],
  family: [
    "결혼 언제 하냐는 질문, 저도 대신 받아드리고 싶어요 🎋",
    "\"엄마 나도 몰라\"가 가장 정직한 대답이에요 😂",
    "사랑하니까 물어보는 거라는 거 알지만... 그래도 좀 쉬어줬으면 😤",
    "명절 때마다 겪는 그 느낌, 온 나라가 다 알아요 🎋",
    "부모님도 사실 어떻게 해야 할지 모르는 거예요. 서로 답 없는 질문 하는 거죠 😭",
  ],
  money: [
    "통장이 파이프가 됐네요. 들어오자마자 나가는 🎋",
    "적금 하나만 만들어봐요. 단돈 만원도 괜찮아요 💸",
    "카드값 나가는 날 월급 들어오는 거, 사실 타이밍 좋은 거예요 😂",
    "이 나라에서 월급쟁이로 사는 게 다 이래요. 당신만 그런 거 아니에요 🎋",
    "내일은 조금 더 나아질 거예요. 오늘 한 잔 참아보는 것부터 🔥",
  ],
  just: [
    "이유 없이 짜증나는 날도 있어야죠. 당연한 거예요 🎋",
    "그냥 짜증나는 것도 충분히 하소연 사유예요 😤",
    "오늘 그냥 일찍 자요. 내일이 낫겠죠 뭐 🎋",
    "짜증이 쌓이면 털어놓는 게 최고예요. 잘 오셨어요 😂",
    "아무 이유 없이 힘든 날이 제일 힘들어요. 수고했어요 오늘도 🔥",
  ],
};

const getSpirit = (category) => {
  const pool = SPIRIT_POOL[category] || SPIRIT_POOL.just;
  return pool[Math.floor(Math.random() * pool.length)];
};

const SAMPLE_POSTS = [
  {
    id: 1, category: "work",
    content: "팀장이 퇴근 5분 전에 긴급 업무 던졌다. 오늘도 야근확정. 진짜 이 회사 왜 다니나 싶음",
    time: "3분 전", reactions: { same: 47, lol: 5, cheer: 12, wow: 8 },
    spiritComment: "퇴근 5분 전 업무는 사실 법으로 금지해야 한다고 생각해요 🎋",
    comments: [
      { id: 101, text: "저도요 진짜 매일같이 ㅠㅠ", time: "2분 전" },
      { id: 102, text: "퇴근 5분전 업무는 국룰임 어딜가나", time: "1분 전" },
    ],
  },
  {
    id: 2, category: "love",
    content: "3년 사귄 남자친구가 갑자기 '우리 잘 맞지 않는 것 같아'라고 문자로 이별통보함. 문자로. 3년을.",
    time: "11분 전", reactions: { same: 89, lol: 0, cheer: 34, wow: 71 },
    spiritComment: "3년이면 최소 전화 통화는 해줘야죠... 문자라니 🎋",
    comments: [{ id: 201, text: "문자로요?? 진짜요?? 너무하다", time: "8분 전" }],
  },
  {
    id: 3, category: "family",
    content: "엄마가 또 결혼 언제 하냐고 물어봄. 저도 모르거든요 엄마. 저도요.",
    time: "28분 전", reactions: { same: 203, lol: 88, cheer: 15, wow: 9 },
    spiritComment: "결혼 언제 하냐는 질문, 저도 대신 받아드리고 싶어요 🎋",
    comments: [],
  },
  {
    id: 4, category: "money",
    content: "월급 들어오는 날이랑 카드값 나가는 날이 같음. 이게 맞나요 진짜로",
    time: "1시간 전", reactions: { same: 312, lol: 145, cheer: 28, wow: 17 },
    spiritComment: "통장이 파이프가 됐네요. 들어오자마자 나가는 🎋",
    comments: [
      { id: 401, text: "저는 들어오자마자 -가 됩니다", time: "45분 전" },
      { id: 402, text: "통장 구경도 못하고 스쳐지나감", time: "30분 전" },
    ],
  },
  {
    id: 5, category: "just",
    content: "아무 이유 없이 그냥 짜증남. 이것도 하소연이 됨?",
    time: "2시간 전", reactions: { same: 567, lol: 234, cheer: 89, wow: 12 },
    spiritComment: "이유 없이 짜증나는 날도 있어야죠. 당연한 거예요 🎋",
    comments: [{ id: 501, text: "됩니다 여기서는 다 됩니다", time: "1시간 전" }],
  },
];

export default function App() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [activeCat, setActiveCat] = useState("all");
  const [showWrite, setShowWrite] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [newCat, setNewCat] = useState("just");
  const [posting, setPosting] = useState(false);
  const [shownSpirit, setShownSpirit] = useState({});
  const [userRx, setUserRx] = useState({});
  const [toast, setToast] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const textareaRef = useRef(null);

  const filtered = activeCat === "all" ? posts : posts.filter(p => p.category === activeCat);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handlePost = () => {
    if (!newPost.trim() || newPost.trim().length < 5) { showToast("조금만 더 써봐요 🎋"); return; }
    setPosting(true);
    const id = Date.now();
    const spirit = getSpirit(newCat);
    const created = {
      id, category: newCat, content: newPost.trim(),
      time: "방금", reactions: { same: 0, lol: 0, cheer: 0, wow: 0 },
      spiritComment: spirit, comments: [],
    };
    setPosts(prev => [created, ...prev]);
    setShownSpirit(prev => ({ ...prev, [id]: true }));
    setNewPost(""); setShowWrite(false); setActiveCat("all"); setPosting(false);
    showToast("대나무숲에 털어놨어요 🎋");
  };

  const handleReaction = (postId, reactionId) => {
    const key = `${postId}_${reactionId}`;
    const already = userRx[key];
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, reactions: { ...p.reactions, [reactionId]: p.reactions[reactionId] + (already ? -1 : 1) } }
      : p
    ));
    setUserRx(prev => ({ ...prev, [key]: !already }));
  };

  const showSpirit = (postId) => setShownSpirit(prev => ({ ...prev, [postId]: true }));

  const toggleComments = (postId) => setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));

  const submitComment = (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, comments: [...p.comments, { id: Date.now(), text, time: "방금" }] }
      : p
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  return (
    <div style={s.root}>
      <div style={s.bambooL}>{"🎋".repeat(8)}</div>
      <div style={s.bambooR}>{"🎋".repeat(8)}</div>

      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.logo}>대나무숲</div>
            <div style={s.sub}>아무도 모르는 내 얘기</div>
          </div>
          <button style={s.writeBtn} onClick={() => setShowWrite(true)}>+ 털어놓기</button>
        </div>
      </header>

      <div style={s.catWrap}>
        <div style={s.catScroll}>
          {CATEGORIES.map(c => (
            <button key={c.id} style={{ ...s.catBtn, ...(activeCat === c.id ? s.catActive : {}) }} onClick={() => setActiveCat(c.id)}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <main style={s.main}>
        {filtered.length === 0 && <div style={s.empty}>아직 아무도 털어놓지 않았어요<br />첫 번째가 되어봐요 🎋</div>}
        {filtered.map(post => {
          const cat = CATEGORIES.find(c => c.id === post.category);
          const isOpen = openComments[post.id];
          const spiritShown = shownSpirit[post.id];
          return (
            <div key={post.id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.catTag}>{cat?.emoji} {cat?.label}</span>
                <span style={s.time}>{post.time}</span>
              </div>
              <p style={s.content}>{post.content}</p>

              <div style={s.reactions}>
                {REACTIONS.map(r => {
                  const key = `${post.id}_${r.id}`;
                  return (
                    <button key={r.id} style={{ ...s.rxBtn, ...(userRx[key] ? s.rxActive : {}) }} onClick={() => handleReaction(post.id, r.id)}>
                      {r.emoji} {r.label}{post.reactions[r.id] > 0 && <span style={s.rxCount}> {post.reactions[r.id]}</span>}
                    </button>
                  );
                })}
              </div>

              <div style={s.actionRow}>
                <button style={s.commentToggleBtn} onClick={() => toggleComments(post.id)}>
                  💬 댓글
                  {post.comments.length > 0 && <span style={s.commentBadge}>{post.comments.length}</span>}
                  <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.5 }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {!spiritShown && (
                  <button style={s.spiritBtn} onClick={() => showSpirit(post.id)}>
                    🎋 정령 부르기
                  </button>
                )}
              </div>

              {spiritShown && post.spiritComment && (
                <div style={s.spiritBox}>
                  <span style={s.spiritLabel}>🎋 대나무 정령</span>
                  <p style={s.spiritText}>{post.spiritComment}</p>
                </div>
              )}

              {isOpen && (
                <div style={s.commentSection}>
                  <div style={s.divider} />
                  {post.comments.length === 0 && <div style={s.noComment}>첫 댓글을 달아봐요 👇</div>}
                  {post.comments.map(c => (
                    <div key={c.id} style={s.commentItem}>
                      <span style={s.commentAnon}>익명</span>
                      <span style={s.commentText}>{c.text}</span>
                      <span style={s.commentTime}>{c.time}</span>
                    </div>
                  ))}
                  <div style={s.commentInputRow}>
                    <input
                      style={s.commentInput}
                      placeholder="익명으로 댓글 달기..."
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") submitComment(post.id); }}
                      maxLength={200}
                    />
                    <button style={s.commentSubmit} onClick={() => submitComment(post.id)}>↑</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {showWrite && (
        <div style={s.overlay} onClick={() => setShowWrite(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>🎋 털어놓기</span>
              <button style={s.closeBtn} onClick={() => setShowWrite(false)}>✕</button>
            </div>
            <p style={s.modalHint}>익명이에요. 아무도 몰라요. 다 털어놔요.</p>
            <div style={s.catSelect}>
              {CATEGORIES.filter(c => c.id !== "all").map(c => (
                <button key={c.id} style={{ ...s.catSelBtn, ...(newCat === c.id ? s.catSelActive : {}) }} onClick={() => setNewCat(c.id)}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <textarea ref={textareaRef} style={s.textarea} placeholder="지금 하고 싶은 말을 다 써요. 욕도 괜찮아요." value={newPost} onChange={e => setNewPost(e.target.value)} maxLength={500} />
            <div style={s.charCount}>{newPost.length}/500</div>
            <button style={{ ...s.submitBtn, ...(posting ? s.submitOff : {}) }} onClick={handlePost} disabled={posting}>
              {posting ? "올리는 중..." : "대나무숲에 던지기 🎋"}
            </button>
          </div>
        </div>
      )}

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "linear-gradient(160deg, #0d1f0f 0%, #1a3a1c 40%, #0f2410 100%)", fontFamily: "'Noto Sans KR', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative", overflowX: "hidden", paddingBottom: 80 },
  bambooL: { position: "fixed", left: 0, top: 0, bottom: 0, writingMode: "vertical-rl", fontSize: 22, opacity: 0.05, pointerEvents: "none", zIndex: 0, lineHeight: 1, letterSpacing: -4 },
  bambooR: { position: "fixed", right: 0, top: 0, bottom: 0, writingMode: "vertical-rl", fontSize: 22, opacity: 0.05, pointerEvents: "none", zIndex: 0, lineHeight: 1, letterSpacing: -4 },
  header: { background: "rgba(10,30,12,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(74,160,70,0.2)", position: "sticky", top: 0, zIndex: 10, padding: "14px 20px" },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 22, fontWeight: 900, color: "#7dd87a", letterSpacing: "-0.5px" },
  sub: { fontSize: 11, color: "rgba(125,216,122,0.45)", marginTop: 2 },
  writeBtn: { background: "linear-gradient(135deg, #4a9e46, #2d7a29)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", boxShadow: "0 4px 15px rgba(74,158,70,0.4)" },
  catWrap: { background: "rgba(10,25,11,0.85)", borderBottom: "1px solid rgba(74,160,70,0.1)", position: "sticky", top: 62, zIndex: 9 },
  catScroll: { display: "flex", overflowX: "auto", padding: "10px 14px", gap: 8, scrollbarWidth: "none" },
  catBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,160,70,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "rgba(200,230,200,0.65)", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Noto Sans KR', sans-serif" },
  catActive: { background: "rgba(74,160,70,0.25)", border: "1px solid #4aa046", color: "#7dd87a", fontWeight: 700 },
  main: { padding: "14px", display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 },
  empty: { textAlign: "center", color: "rgba(125,216,122,0.38)", padding: "60px 20px", lineHeight: 2, fontSize: 15 },
  card: { background: "rgba(20,45,22,0.88)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "16px", border: "1px solid rgba(74,160,70,0.14)", boxShadow: "0 4px 20px rgba(0,0,0,0.28)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  catTag: { fontSize: 12, color: "#7dd87a", background: "rgba(74,160,70,0.15)", padding: "3px 10px", borderRadius: 10, fontWeight: 600 },
  time: { fontSize: 11, color: "rgba(125,216,122,0.32)" },
  content: { fontSize: 15, color: "rgba(220,240,220,0.88)", lineHeight: 1.7, margin: "0 0 14px", wordBreak: "keep-all" },
  reactions: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 },
  rxBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,160,70,0.2)", borderRadius: 20, padding: "5px 11px", fontSize: 13, color: "rgba(200,230,200,0.65)", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", display: "flex", alignItems: "center" },
  rxActive: { background: "rgba(74,160,70,0.22)", border: "1px solid #4aa046", color: "#7dd87a", fontWeight: 700 },
  rxCount: { fontSize: 11, opacity: 0.8, marginLeft: 3 },
  actionRow: { display: "flex", gap: 8, marginBottom: 10 },
  commentToggleBtn: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,160,70,0.2)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "rgba(200,230,200,0.65)", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", display: "flex", alignItems: "center", gap: 5 },
  commentBadge: { background: "rgba(74,160,70,0.3)", color: "#7dd87a", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 },
  spiritBtn: { flex: 1, background: "transparent", border: "1px dashed rgba(74,160,70,0.35)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "rgba(125,216,122,0.6)", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },
  spiritBox: { background: "rgba(74,160,70,0.08)", border: "1px solid rgba(74,160,70,0.22)", borderRadius: 10, padding: "11px 13px", marginBottom: 4 },
  spiritLabel: { fontSize: 11, color: "#7dd87a", fontWeight: 700, display: "block", marginBottom: 5 },
  spiritText: { fontSize: 14, color: "rgba(210,240,210,0.83)", lineHeight: 1.6, margin: 0, fontStyle: "italic" },
  commentSection: { marginTop: 8 },
  divider: { height: 1, background: "rgba(74,160,70,0.1)", marginBottom: 10 },
  noComment: { textAlign: "center", fontSize: 13, color: "rgba(125,216,122,0.35)", padding: "6px 0 10px" },
  commentItem: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9, flexWrap: "wrap" },
  commentAnon: { fontSize: 11, color: "#7dd87a", fontWeight: 700, whiteSpace: "nowrap", marginTop: 2 },
  commentText: { fontSize: 14, color: "rgba(210,235,210,0.8)", lineHeight: 1.5, flex: 1 },
  commentTime: { fontSize: 10, color: "rgba(125,216,122,0.3)", whiteSpace: "nowrap", marginTop: 3 },
  commentInputRow: { display: "flex", gap: 8, marginTop: 6 },
  commentInput: { flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,160,70,0.22)", borderRadius: 20, padding: "9px 14px", fontSize: 14, color: "rgba(220,240,220,0.9)", outline: "none", fontFamily: "'Noto Sans KR', sans-serif" },
  commentSubmit: { background: "linear-gradient(135deg, #4a9e46, #2d7a29)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.77)", zIndex: 100, display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)" },
  modal: { background: "linear-gradient(160deg, #0d1f0f, #1a3a1c)", border: "1px solid rgba(74,160,70,0.28)", borderRadius: "20px 20px 0 0", padding: "22px 20px 50px", width: "100%", maxWidth: 480, margin: "0 auto" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  modalTitle: { fontSize: 18, fontWeight: 900, color: "#7dd87a" },
  closeBtn: { background: "transparent", border: "none", color: "rgba(125,216,122,0.45)", fontSize: 20, cursor: "pointer", padding: 4 },
  modalHint: { fontSize: 12, color: "rgba(125,216,122,0.38)", marginBottom: 14 },
  catSelect: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  catSelBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,160,70,0.2)", borderRadius: 16, padding: "6px 12px", fontSize: 13, color: "rgba(200,230,200,0.58)", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },
  catSelActive: { background: "rgba(74,160,70,0.24)", border: "1px solid #4aa046", color: "#7dd87a", fontWeight: 700 },
  textarea: { width: "100%", minHeight: 130, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,160,70,0.24)", borderRadius: 12, padding: "13px", fontSize: 15, color: "rgba(220,240,220,0.9)", resize: "none", fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6, outline: "none", boxSizing: "border-box" },
  charCount: { textAlign: "right", fontSize: 11, color: "rgba(125,216,122,0.3)", marginTop: 5, marginBottom: 13 },
  submitBtn: { width: "100%", background: "linear-gradient(135deg, #4a9e46, #2d7a29)", color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", boxShadow: "0 4px 18px rgba(74,158,70,0.38)" },
  submitOff: { opacity: 0.5, cursor: "not-allowed" },
  toast: { position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)", background: "rgba(74,160,70,0.95)", color: "#fff", padding: "11px 22px", borderRadius: 30, fontSize: 14, fontWeight: 700, zIndex: 200, whiteSpace: "nowrap", boxShadow: "0 4px 18px rgba(0,0,0,0.35)", fontFamily: "'Noto Sans KR', sans-serif" },
};
