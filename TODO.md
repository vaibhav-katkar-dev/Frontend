# TODO: Add Loading Bar and Upgrade Notification Bar in responses.html

## Steps to Complete:
- [x] Add HTML element for loading bar (a div with id="loading-bar" positioned at the top of the page).
- [x] Add CSS styles for the loading bar: minimal animated gradient bar, hidden by default, responsive.
- [x] Modify JavaScript to show loading bar before fetch starts and hide it after fetch completes (success or error).
- [ ] Test the page to ensure loading bar appears during fetch and disappears after, looks good on mobile and desktop.
- [x] Add CSS styles for upgrade notification bar: fixed bottom, premium gradient, responsive, with close button.
- [x] Modify JavaScript to check data.upgradeRequired and show the bar if true, with dismiss option.
- [x] Update message to be more catchy and premium-like with hook words and rocket emoji.
- [ ] Test the upgrade bar appears when upgradeRequired is true and can be dismissed.
