// Hiện nút khi cuộn xuống
window.onscroll = function() {
  let btn = document.getElementById("scrollTopBtn");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btn.style.display = "flex"; // hiện nút
  } else {
    btn.style.display = "none"; // ẩn nút
  }
};

// Cuộn lên đầu khi bấm nút
document.getElementById("scrollTopBtn").addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // hiệu ứng cuộn mượt
  });
});
