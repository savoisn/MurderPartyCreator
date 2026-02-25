#!/bin/bash
# Manual API test script
#   Run:     bash test-api.sh
#   Dry run: bash test-api.sh --dry-run
# Requires: curl, jq, server running on localhost:3000

BASE="http://localhost:3000"
DRY_RUN=false

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  # Placeholder IDs for dry-run output
  SCENARIO_ID="<SCENARIO_ID>"
  CHAR1_ID="<CHARACTER_1_ID>"
  CHAR2_ID="<CHARACTER_2_ID>"
  CLUE1_ID="<CLUE_1_ID>"
  CLUE2_ID="<CLUE_2_ID>"
  SESSION_ID="<SESSION_ID>"
  PLAYER1_ID="<PLAYER_1_ID>"
fi

run() {
  if $DRY_RUN; then
    echo "$@"
  else
    "$@"
  fi
}

echo "=== Health ==="
run curl -s "$BASE/health"

echo -e "\n=== Create Scenario ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/scenarios -H 'Content-Type: application/json' -d '{\"title\":\"Murder at the Grand Hotel\",\"description\":\"A wealthy businessman is found dead in the library\",\"setting\":\"1920s Grand Hotel\",\"difficulty\":\"medium\",\"minPlayers\":4,\"maxPlayers\":8}'"
else
  SCENARIO=$(curl -s -X POST "$BASE/scenarios" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Murder at the Grand Hotel",
      "description": "A wealthy businessman is found dead in the library",
      "setting": "1920s Grand Hotel",
      "difficulty": "medium",
      "minPlayers": 4,
      "maxPlayers": 8
    }')
  echo "$SCENARIO" | jq .
  SCENARIO_ID=$(echo "$SCENARIO" | jq -r '.data.id')
fi

echo -e "\n=== List Scenarios ==="
run curl -s "$BASE/scenarios"

echo -e "\n=== Get Scenario ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID"

echo -e "\n=== Update Scenario ==="
run curl -s -X PUT "$BASE/scenarios/$SCENARIO_ID" \
  -H "Content-Type: application/json" \
  -d '{"title": "Murder at the Grand Hotel (Revised)"}'

echo -e "\n=== Create Character 1 ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/scenarios/$SCENARIO_ID/characters -H 'Content-Type: application/json' -d '{\"name\":\"Lady Victoria Sterling\",\"description\":\"A sophisticated socialite with sharp wit\",\"secret\":\"She is secretly bankrupt\",\"isMurderer\":false}'"
else
  CHAR1=$(curl -s -X POST "$BASE/scenarios/$SCENARIO_ID/characters" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Lady Victoria Sterling",
      "description": "A sophisticated socialite with sharp wit",
      "secret": "She is secretly bankrupt",
      "isMurderer": false
    }')
  echo "$CHAR1" | jq .
  CHAR1_ID=$(echo "$CHAR1" | jq -r '.data.id')
fi

echo -e "\n=== Create Character 2 ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/scenarios/$SCENARIO_ID/characters -H 'Content-Type: application/json' -d '{\"name\":\"Colonel Blackwood\",\"description\":\"A retired military officer with a mysterious past\",\"secret\":\"He discovered the victim was selling military secrets\",\"isMurderer\":true}'"
else
  CHAR2=$(curl -s -X POST "$BASE/scenarios/$SCENARIO_ID/characters" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Colonel Blackwood",
      "description": "A retired military officer with a mysterious past",
      "secret": "He discovered the victim was selling military secrets",
      "isMurderer": true
    }')
  echo "$CHAR2" | jq .
  CHAR2_ID=$(echo "$CHAR2" | jq -r '.data.id')
fi

echo -e "\n=== List Characters ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID/characters"

echo -e "\n=== Get Character ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID/characters/$CHAR1_ID"

echo -e "\n=== Update Character ==="
run curl -s -X PUT "$BASE/scenarios/$SCENARIO_ID/characters/$CHAR1_ID" \
  -H "Content-Type: application/json" \
  -d '{"name": "Lady Victoria Sterling III"}'

echo -e "\n=== Create Clue 1 ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/scenarios/$SCENARIO_ID/clues -H 'Content-Type: application/json' -d '{\"title\":\"Torn Letter\",\"description\":\"A partially burned letter mentioning military documents\",\"type\":\"document\",\"revealOrder\":1}'"
else
  CLUE1=$(curl -s -X POST "$BASE/scenarios/$SCENARIO_ID/clues" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Torn Letter",
      "description": "A partially burned letter mentioning military documents",
      "type": "document",
      "revealOrder": 1
    }')
  echo "$CLUE1" | jq .
  CLUE1_ID=$(echo "$CLUE1" | jq -r '.data.id')
fi

echo -e "\n=== Create Clue 2 ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/scenarios/$SCENARIO_ID/clues -H 'Content-Type: application/json' -d '{\"title\":\"Muddy Boots\",\"description\":\"Military-style boots found near the back entrance\",\"type\":\"physical\",\"revealOrder\":2}'"
else
  CLUE2=$(curl -s -X POST "$BASE/scenarios/$SCENARIO_ID/clues" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Muddy Boots",
      "description": "Military-style boots found near the back entrance",
      "type": "physical",
      "revealOrder": 2
    }')
  echo "$CLUE2" | jq .
  CLUE2_ID=$(echo "$CLUE2" | jq -r '.data.id')
fi

echo -e "\n=== List Clues (ordered by revealOrder) ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID/clues"

echo -e "\n=== Get Clue ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID/clues/$CLUE1_ID"

echo -e "\n=== Update Clue ==="
run curl -s -X PUT "$BASE/scenarios/$SCENARIO_ID/clues/$CLUE1_ID" \
  -H "Content-Type: application/json" \
  -d '{"type": "testimony"}'

echo -e "\n=== Create Session ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/sessions -H 'Content-Type: application/json' -d '{\"scenarioId\":\"$SCENARIO_ID\"}'"
else
  SESSION=$(curl -s -X POST "$BASE/sessions" \
    -H "Content-Type: application/json" \
    -d "{\"scenarioId\": \"$SCENARIO_ID\"}")
  echo "$SESSION" | jq .
  SESSION_ID=$(echo "$SESSION" | jq -r '.data.id')
fi

echo -e "\n=== List Sessions ==="
run curl -s "$BASE/sessions"

echo -e "\n=== Add Player 1 to Session ==="
if $DRY_RUN; then
  echo "curl -s -X POST $BASE/sessions/$SESSION_ID/players -H 'Content-Type: application/json' -d '{\"characterId\":\"$CHAR1_ID\",\"playerName\":\"Alice\"}'"
else
  PLAYER1=$(curl -s -X POST "$BASE/sessions/$SESSION_ID/players" \
    -H "Content-Type: application/json" \
    -d "{\"characterId\": \"$CHAR1_ID\", \"playerName\": \"Alice\"}")
  echo "$PLAYER1" | jq .
  PLAYER1_ID=$(echo "$PLAYER1" | jq -r '.data.id')
fi

echo -e "\n=== Add Player 2 to Session ==="
run curl -s -X POST "$BASE/sessions/$SESSION_ID/players" \
  -H "Content-Type: application/json" \
  -d "{\"characterId\": \"$CHAR2_ID\", \"playerName\": \"Bob\"}"

echo -e "\n=== Get Session (with players and clues) ==="
run curl -s "$BASE/sessions/$SESSION_ID"

echo -e "\n=== Transition Session: draft -> active ==="
run curl -s -X PATCH "$BASE/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

echo -e "\n=== Reveal Clue ==="
run curl -s -X POST "$BASE/sessions/$SESSION_ID/clues/$CLUE1_ID/reveal"

echo -e "\n=== Reveal Same Clue Again (should 409) ==="
run curl -s -X POST "$BASE/sessions/$SESSION_ID/clues/$CLUE1_ID/reveal"

echo -e "\n=== Reveal Second Clue ==="
run curl -s -X POST "$BASE/sessions/$SESSION_ID/clues/$CLUE2_ID/reveal"

echo -e "\n=== Transition Session: active -> completed ==="
run curl -s -X PATCH "$BASE/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

echo -e "\n=== Invalid Transition: completed -> draft (should 400) ==="
run curl -s -X PATCH "$BASE/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "draft"}'

echo -e "\n=== Remove Player ==="
run curl -s -X DELETE "$BASE/sessions/$SESSION_ID/players/$PLAYER1_ID"

echo -e "\n=== Delete Clue ==="
run curl -s -X DELETE "$BASE/scenarios/$SCENARIO_ID/clues/$CLUE2_ID"

echo -e "\n=== Delete Character ==="
run curl -s -X DELETE "$BASE/scenarios/$SCENARIO_ID/characters/$CHAR2_ID"

echo -e "\n=== Delete Session ==="
run curl -s -X DELETE "$BASE/sessions/$SESSION_ID"

echo -e "\n=== Delete Scenario (cascades characters + clues) ==="
run curl -s -X DELETE "$BASE/scenarios/$SCENARIO_ID"

echo -e "\n=== Verify Scenario Deleted (should 404) ==="
run curl -s "$BASE/scenarios/$SCENARIO_ID"

echo -e "\nDone!"
