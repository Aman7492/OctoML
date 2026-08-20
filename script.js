const symbols = ["🍒","⭐","💎","🍀","7️⃣","🔔"];
let balance = 0;
let spinning = false;

const $ = id => document.getElementById(id);
const balanceEl = $("balance");
const messageEl = $("message");
const reels = [...document.querySelectorAll(".reel")];

function money(n){ return `$${n.toLocaleString()}`; }

function updateBalance(){ balanceEl.textContent = money(balance); }

$("depositBtn").addEventListener("click", () => {
  const value = prompt("How much would you like to deposit?", "500");
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    messageEl.textContent = "Please enter a valid amount greater than $0.";
    return;
  }
  balance += Math.floor(amount);
  updateBalance();
  messageEl.textContent = "Deposit successful. Good luck!";
});

$("spinBtn").addEventListener("click", () => {
  if (spinning) return;

  const lines = Number($("lines").value);
  const bet = Number($("bet").value);
  const totalBet = lines * bet;

  if (!Number.isInteger(bet) || bet < 1 || bet > 1000) {
    messageEl.textContent = "Bet must be between $1 and $1,000.";
    return;
  }
  if (totalBet > balance) {
    messageEl.textContent = `Not enough balance. You need ${money(totalBet)}.`;
    return;
  }

  balance -= totalBet;
  updateBalance();
  $("totalBet").textContent = money(totalBet);
  $("lastWin").textContent = "$0";
  $("winningLines").textContent = "—";

  spinning = true;
  $("spinBtn").disabled = true;
  $("depositBtn").disabled = true;
  $("reels").classList.add("spinning");
  messageEl.textContent = "Spinning...";

  const timer = setInterval(() => {
    reels.forEach(r => r.textContent = symbols[Math.floor(Math.random()*symbols.length)]);
  }, 90);

  setTimeout(() => {
    clearInterval(timer);
    $("reels").classList.remove("spinning");

    const result = reels.map(r => {
      const value = symbols[Math.floor(Math.random()*symbols.length)];
      r.textContent = value;
      r.classList.remove("win");
      return value;
    });

    let win = 0;
    const wins = [];

    for(let row=0; row<lines; row++){
      const a = result[row], b = result[3+row], c = result[6+row];
      if(a === b && b === c){
        const payout = a === "7️⃣" ? 10 : a === "💎" ? 8 : a === "⭐" ? 6 : 4;
        win += bet * payout;
        wins.push(row + 1);
        reels[row].classList.add("win");
        reels[3+row].classList.add("win");
        reels[6+row].classList.add("win");
      }
    }

    balance += win;
    updateBalance();
    $("lastWin").textContent = money(win);
    $("winningLines").textContent = wins.length ? wins.join(", ") : "—";
    messageEl.textContent = win ? `🎉 You won ${money(win)}!` : "No win this time. Try again!";
    spinning = false;
    $("spinBtn").disabled = false;
    $("depositBtn").disabled = false;
  }, 1000);
});

updateBalance();
