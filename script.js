// Starfield canvas script
      (() => {
        const canvas = document.getElementById("starfield");
        const ctx = canvas.getContext("2d");

        let W = (canvas.width = innerWidth);
        let H = (canvas.height = innerHeight);
        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.scale(DPR, DPR);

        const STAR_COUNT = Math.round((W * H) / 9000); // tự điều chỉnh theo kích thước màn hình
        const stars = [];
        let mouseX = W / 2,
          mouseY = H / 2;
        let time = 0;

        function rand(min, max) {
          return Math.random() * (max - min) + min;
        }

        for (let i = 0; i < STAR_COUNT; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: rand(0.4, 2.4),
            speed: rand(0.02, 0.5),
            alphaBase: rand(0.15, 0.95),
            twinkleOffset: Math.random() * 1000,
            hue: rand(250, 290), // slight purple hue range
          });
        }

        function resize() {
          W = canvas.width = innerWidth;
          H = canvas.height = innerHeight;
          canvas.width = W * DPR;
          canvas.height = H * DPR;
          canvas.style.width = W + "px";
          canvas.style.height = H + "px";
          ctx.scale(DPR, DPR);
        }

        window.addEventListener("resize", () => {
         
          resize();
        });

        // Mouse parallax
        window.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });
        window.addEventListener(
          "touchmove",
          (e) => {
            if (e.touches && e.touches[0]) {
              mouseX = e.touches[0].clientX;
              mouseY = e.touches[0].clientY;
            }
          },
          { passive: true }
        );

        function draw() {
          time += 0.016;
          ctx.clearRect(0, 0, W, H);

          // subtle gradient background on canvas (overlaid on body gradient)
          const g = ctx.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, "rgba(12,8,22,0.0)");
          g.addColorStop(1, "rgba(6,2,18,0.0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);

          // compute parallax offset from center
          const px = (mouseX - W / 2) / (W / 2);
          const py = (mouseY - H / 2) / (H / 2);

          for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // movement slightly influenced by parallax and speed
            s.x += s.speed * (0.4 + s.size / 2) + px * (s.size * 0.08);
            s.y +=
              Math.sin((time + s.twinkleOffset) * 0.2) * 0.02 +
              py * (s.size * 0.04);

            // wrap
            if (s.x > W + 10) s.x = -10;
            if (s.x < -10) s.x = W + 10;
            if (s.y > H + 10) s.y = -10;
            if (s.y < -10) s.y = H + 10;

            // twinkle
            const alpha =
              s.alphaBase * (0.6 + 0.4 * Math.sin(time * 3 + s.twinkleOffset));

            // draw halo
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(
              s.x,
              s.y,
              0,
              s.x,
              s.y,
              Math.max(1, s.size * 3.5)
            );
            const hue = Math.round(s.hue);
            gradient.addColorStop(
              0,
              `rgba(${180},${150},${255},${Math.max(0.03, alpha * 0.9)})`
            );
            gradient.addColorStop(0.35, `rgba(120,80,200,${alpha * 0.35})`);
            gradient.addColorStop(1, `rgba(10,6,20,0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(
              s.x - s.size * 3.5,
              s.y - s.size * 3.5,
              s.size * 7,
              s.size * 7
            );

            // draw core
            ctx.beginPath();
            ctx.globalAlpha = Math.min(1, Math.max(0.05, alpha));
            ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha * 1.1)})`;
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          requestAnimationFrame(draw);
        }

        draw();

        // Expose a small API to change density/speed from console if desired
        window.COSMIC = {
          addStars(n = 30) {
            for (let i = 0; i < n; i++)
              stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: rand(0.4, 2.6),
                speed: rand(0.02, 0.7),
                alphaBase: rand(0.12, 0.9),
                twinkleOffset: Math.random() * 1000,
                hue: rand(250, 290),
              });
          },
          setDensity(factor) {
            // factor relative to initial count
            const target = Math.max(20, Math.round(STAR_COUNT * (factor || 1)));
            while (stars.length < target) this.addStars(10);
            while (stars.length > target) stars.pop();
          },
        };
      })();