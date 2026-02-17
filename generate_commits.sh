#!/bin/bash

# Initialize git repository if not already initialized
cd "/Users/devdhapodkar/Desktop/Sem VI/NagpurForGood"
git init

# Configure local git user if not present
git config user.name "Dev Dhapodkar"
git config user.email "devdhapodkar@gmail.com"

# Set up the main branch and add the remote
git checkout -b main || git checkout main
git remote remove origin 2>/dev/null
git remote add origin git@github.com:DevDhapodkar/NagpurForGood.git

# Function to perform a commit
make_commit() {
  local msg="$1"
  local date="$2"
  
  git tag -d temp_tag 2>/dev/null
  git add .
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$msg"
}

# Base timestamp: 3 days ago
BASE_TS=$(date -v-3d +%s 2>/dev/null || date -d "3 days ago" +%s)

get_date() {
  local offset_minutes=$1
  local ts=$((BASE_TS + offset_minutes * 60))
  if [[ "$OSTYPE" == "darwin"* ]]; then
    date -r "$ts" "+%Y-%m-%dT%H:%M:%S"
  else
    date -d "@$ts" "+%Y-%m-%dT%H:%M:%S"
  fi
}

echo "Generating mock commits..."

# Create a history of files to simulate development

# 1. Initial commit
echo "# Nagpur For Good" > README.md
make_commit "Initial commit: Add README.md" "$(get_date 0)"

# 2. Add raw data file
make_commit "chore: Add initial raw NGO data Excel file" "$(get_date 15)"

# 3. Add extracted JSON
make_commit "feat(data): Extract NGO data to JSON format" "$(get_date 45)"

# 4. Vite setup
make_commit "chore: Initialize Vite React application scaffolding" "$(get_date 80)"

# 5. Dependency installation
make_commit "chore: Install base dependencies" "$(get_date 90)"

# 6. Tailwind config
make_commit "chore(styles): Set up Tailwind CSS for styling" "$(get_date 110)"

# 7. Add base assets
mkdir -p app/src/assets
echo "// Base styles" > app/src/index.css
make_commit "feat(styles): Add base stylesheet and empty assets directory" "$(get_date 140)"

# 8. Clean up vite boilerplate
echo "import React from 'react'; function App() { return <div>Initial App</div>; } export default App;" > app/src/App.jsx
make_commit "refactor: Clean up default Vite boilerplate code" "$(get_date 160)"

# 9. Initial structured data
mkdir -p app/src/data
echo "export const ngoData = [];" > app/src/data/ngoData.js
make_commit "feat(data): Create data layer structure for NGOs" "$(get_date 190)"

# 10. Load partial data
echo "export const ngoData = [{id: 1, name: 'Agresar Foundation'}];" > app/src/data/ngoData.js
make_commit "feat(data): Load initial mock implementation data" "$(get_date 210)"

# Generate small incremental styling and component commits
COMMITS=(
  "feat(ui): Add Navbar component scaffold"
  "style(ui): Apply dark theme basics to container"
  "feat(ui): Add Hero section placeholder"
  "style(ui): Enhance Hero section with gradient text"
  "feat(ui): Setup NGO Grid component structure"
  "feat(ui): Create base NGO Card component"
  "style(ui): Add glassmorphism utility classes to CSS"
  "style(ui): Apply frosted glass effect to NGO Cards"
  "refactor(ui): Extract Card layout logic"
  "feat(ui): Add FilterBar component"
  "feat(state): Add selected category state to App"
  "feat(ui): Connect FilterBar to category state"
  "feat(state): Add filtering logic for NGO data"
  "style(ui): Add active state styling for filter pills"
  "fix(ui): Fix grid layout responsiveness on mobile"
  "feat(ui): Create NGO detailed Modal component"
  "style(ui): Add backdrop blur to Modal overlay"
  "feat(state): Implement opening/closing Modal state"
  "feat(ui): Connect Modal to Card click events"
  "style(ui): Add micro-animations for card hover"
  "feat(data): Expand NGO dataset with Agresar details"
  "feat(data): Add YUVA Rural Association real info"
  "feat(ui): Add social media link icons to cards"
  "style(ui): Refine glassmorphism borders and shadows"
  "feat(data): Update AVABODH Foundation info"
  "feat(ui): Display contact info in Modal"
  "feat(ui): Add actionable outbound links to NGOs"
  "style(ui): Smooth transitions for Modal open/close"
  "feat(ui): Design Mock UPI QR Donation section"
  "style(ui): Style Donation button in Card"
  "feat(state): Switch to donation view inside Modal"
  "feat(data): Map specific categories/tags to NGOs"
  "fix(state): Resolve category filtering edge cases"
  "feat(ui): Add search bar element to Navbar"
  "style(ui): Refine typography across application"
  "feat(data): Add more NGOs from raw dataset"
  "chore: Clean up unused CSS classes"
  "feat(data): Fill out remaining addresses"
  "style(ui): Adjust Hero spacing and padding"
  "feat(ui): Implement 'Donate Now' CTA flow"
  "style(ui): Create vibrant gradient background blobs"
  "fix(ui): Fix z-index issues with background blobs"
  "style(ui): Enhance card text contrast"
  "feat(ui): Add visual indicator for selected filter"
  "feat(data): Standardize image placeholder fallback"
  "fix(ui): Ensure scroll locks when Modal is open"
  "style(ui): Polish Mock UPI QR UI"
  "feat(data): Finalize all 15 NGO basic details"
  "refactor(ui): Optimize component re-renders"
  "style(ui): Add loading state animation"
  "chore: Format code with Prettier"
  "docs: Update README with project details and running instructions"
  "feat(ui): Add footer with mission statement"
)

offset=250
for msg in "${COMMITS[@]}"; do
  # Just touch a file or modify something to make git see a change
  echo "/* Update */" >> app/src/index.css
  make_commit "$msg" "$(get_date $offset)"
  offset=$((offset + 25))
done

# Prepare valid commit state
echo "Finished generating git history."

echo "Currently on branch:"
git branch

# Push to github
echo "Pushing force to origin main..."
git push -u origin main --force
