# Manual test flow: PIN validation & error clearing

Run the app (`npm run dev` or your usual command), then follow these steps.

---

## 1. Join with letters (PIN must be digits)

1. On the landing page, click **Join Session**.
2. In the PIN field, type letters only (e.g. `ABCDEF`).
   - **Expect:** Input stays empty or only digits are accepted (depending on implementation). If you paste letters, they should be stripped.
3. If you somehow submit non-digits (e.g. 6 letters), click **Connect**.
   - **Expect:** Error message: **"PIN must be exactly 6 digits."**

---

## 2. Error clears when switching cards

1. Trigger an error (e.g. enter `ABCDEF` and submit, or enter a wrong 6-digit PIN and submit so you see "Could not connect. Check PIN." or "Invalid PIN").
2. **Expect:** Red error banner is visible.
3. Click **Start Session** (Create).
   - **Expect:** Error banner disappears.
4. Trigger an error again (e.g. wrong PIN), then click **Load Saved**.
   - **Expect:** Error banner disappears.
5. Enter an invalid cloud code and submit (or use a non-existent code).
   - **Expect:** Cloud error appears.
6. Click **Join Session**.
   - **Expect:** Error banner disappears.

---

## 3. Join with valid 6-digit PIN (sanity check)

1. In one tab/window: click **Start Session**. Note the 6-digit PIN.
2. In another tab (or device): click **Join Session**, enter that PIN, click **Connect**.
   - **Expect:** Second client joins the session (shared code pad).

---

**Pass:** All “Expect” outcomes match.  
**Fail:** Note which step and what you saw instead.
