# Testing Guide

## Testing Checklist for Testers

Use this guide to thoroughly test the application before production use.

## Test Scenarios

### 1. Basic Functionality Test

**Steps:**
1. Open the application
2. Verify default values are loaded:
   - Token address is pre-filled
   - Interval is set to "1H"
   - Dates are pre-filled
3. Click "Execute" without changes
4. Verify chart loads successfully

**Expected Result:**
- Chart displays with candlestick data
- No errors shown
- Candle count is displayed

---

### 2. Token Address Test

**Test Case A: Valid Token**
```
Token: cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij
Interval: 1H
Date Range: Last 24 hours
```

**Expected:** Chart loads successfully

**Test Case B: Different Valid Token**
```
Token: So11111111111111111111111111111111111111112 (SOL)
Interval: 1D
Date Range: Last 7 days
```

**Expected:** Chart loads with SOL data

**Test Case C: Invalid Token**
```
Token: invalid_token_123
```

**Expected:** Error message displayed

---

### 3. Interval Selection Test

Test each interval option:

- [ ] 1M (1 Minute)
- [ ] 5M (5 Minutes)
- [ ] 1H (1 Hour)
- [ ] 4H (4 Hours)
- [ ] 6H (6 Hours)
- [ ] 1D (1 Day)
- [ ] 3D (3 Days)
- [ ] 1W (1 Week)

**For each interval:**
1. Select interval
2. Adjust date range appropriately
3. Execute query
4. Verify chart displays correct timeframe

---

### 4. Date Range Test

**Test Case A: Valid Range**
```
From: 2025-10-14 00:00
To: 2025-10-15 00:00
```

**Expected:** Chart loads with 24 hours of data

**Test Case B: Large Range**
```
From: 2025-10-01 00:00
To: 2025-10-15 00:00
Interval: 1D
```

**Expected:** Chart loads with multiple days

**Test Case C: Future Dates**
```
From: 2026-01-01 00:00
To: 2026-01-02 00:00
```

**Expected:** Either no data or appropriate message

**Test Case D: Reversed Range (To before From)**
```
From: 2025-10-15 00:00
To: 2025-10-14 00:00
```

**Expected:** Error or empty result

---

### 5. API Endpoint Test

**Test both endpoints:**

1. **Sandbox Endpoint**
   - Select "Sandbox"
   - Execute query
   - Verify data loads

2. **Staging Endpoint**
   - Select "Staging"
   - Execute same query
   - Verify data loads

**Compare results:**
- Note any differences in data
- Check response times

---

### 6. Chart Interaction Test

**Pan Test:**
- Click and drag on chart
- Verify chart pans smoothly

**Zoom Test:**
- Scroll up/down on chart
- Verify chart zooms in/out

**Crosshair Test:**
- Hover over candles
- Verify price and time tooltip appears

**Auto-fit Test:**
- After loading data, verify all candles are visible
- Check that chart is not cut off

---

### 7. Error Handling Test

**Network Error Simulation:**
- Disconnect internet
- Try to execute query
- Reconnect
- Verify error message is clear

**Invalid Input:**
- Leave token address empty
- Click Execute
- Verify appropriate handling

---

### 8. Responsive Design Test

**Desktop (1920x1080):**
- [ ] Layout is clean
- [ ] Form fields in 2 columns
- [ ] Chart fills width appropriately

**Tablet (768x1024):**
- [ ] Layout adapts
- [ ] Form remains usable
- [ ] Chart is responsive

**Mobile (375x667):**
- [ ] Form fields stack vertically
- [ ] Buttons are tap-friendly
- [ ] Chart is viewable and interactive

---

### 9. Browser Compatibility Test

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**For each browser, verify:**
- Chart renders correctly
- All controls work
- No console errors

---

### 10. Performance Test

**Small Dataset:**
```
Interval: 1H
Range: 24 hours
```
- [ ] Loads quickly (< 3 seconds)

**Large Dataset:**
```
Interval: 1M
Range: 7 days
```
- [ ] Loads without freezing
- [ ] Chart remains responsive

---

### 11. Edge Cases

**Test Case A: No Data Available**
```
Token: Valid but new/illiquid token
Date Range: Recent
```
**Expected:** Appropriate "no data" message

**Test Case B: Partial Data**
```
Date Range: Includes periods with no trading
```
**Expected:** Chart shows available data with gaps

**Test Case C: Very Old Data**
```
Date Range: From several years ago
```
**Expected:** Either shows data or indicates unavailability

---

## Bug Reporting Template

When reporting issues, please include:

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- Browser:
- OS:
- Screen Size:
- Token Address:
- Interval:
- Date Range:
- Endpoint:

**Screenshots:**
[Attach if possible]

**Console Errors:**
[Any errors from browser console]
```

---

## Performance Metrics to Monitor

- **Load Time:** How long until chart appears
- **Interaction Lag:** Delay when panning/zooming
- **Memory Usage:** Check browser task manager
- **API Response Time:** Network tab in DevTools

---

## Known Limitations

1. Chart requires JavaScript enabled
2. Datetime picker appearance varies by browser
3. Large datasets (>1000 candles) may load slower
4. API rate limits may apply

---

## Success Criteria

Application is ready for production when:

- [ ] All test scenarios pass
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] Works on all target browsers
- [ ] Mobile experience is smooth
- [ ] Error messages are clear
- [ ] Chart is accurate and interactive
