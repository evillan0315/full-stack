### ✅ **Unified Bash Script**

````bash
#!/bin/bash

# Title: Markdown + Code Extractor Combined
# Description: Extracts code blocks from a Markdown file, then processes each code file
#              to find and save code based on `// src/target directory` declarations.

INPUT_FILE="$1"
OUTPUT_ROOT="output"

if [[ -z "$INPUT_FILE" ]]; then
  echo "Usage: $0 <input-markdown-file>"
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Error: File '$INPUT_FILE' not found."
  exit 1
fi

mkdir -p "$OUTPUT_ROOT"
TMP_FILE=$(mktemp)

# --------- MARKDOWN CODE BLOCK EXTRACTOR ---------
awk '
  BEGIN { in_block = 0; lang = "plain"; title = "untitled" }
  /^```/ {
    if (in_block) {
      print "__END_BLOCK__"
      in_block = 0
    } else {
      lang = substr($0, 4)
      if (lang == "") lang = "plain"
      print "__START_BLOCK__ " lang
      title = "untitled"
      in_block = 1
    }
    next
  }
  {
    if (in_block) {
      if ($0 ~ /^#* *Title:/) {
        sub(/^#* *Title:[[:space:]]*/, "", $0)
        title = $0
      }
      print $0
    }
  }
' "$INPUT_FILE" > "$TMP_FILE"

declare -A INDEX_MAP
LANG=""
TITLE=""
DIR=""

sanitize() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g'
}

CODE_FILES=()

while IFS= read -r line; do
  if [[ "$line" == __START_BLOCK__* ]]; then
    LANG="${line#__START_BLOCK__ }"
    INDEX_MAP["$LANG,${TITLE:-untitled}"]=0
    CODE_BLOCK=""
  elif [[ "$line" == __END_BLOCK__ ]]; then
    SAN_TITLE=$(sanitize "${TITLE:-untitled}")
    EXT="txt"
    case "$LANG" in
      typescript) EXT="ts" ;;
      javascript) EXT="js" ;;
      bash|shell) EXT="sh" ;;
      python) EXT="py" ;;
      html) EXT="html" ;;
      css) EXT="css" ;;
      json) EXT="json" ;;
      markdown|md) EXT="md" ;;
    esac

    INDEX_MAP["$LANG,$SAN_TITLE"]=$((INDEX_MAP["$LANG,$SAN_TITLE"]+1))
    IDX=${INDEX_MAP["$LANG,$SAN_TITLE"]}
    DIR="$OUTPUT_ROOT/$SAN_TITLE/$LANG"
    mkdir -p "$DIR"
    FILE="$DIR/${LANG}-${IDX}.${EXT}"

    echo -n "$CODE_BLOCK" > "$FILE"
    echo "Saved: $FILE"
    CODE_FILES+=("$FILE")

  else
    if [[ "$line" =~ ^[[:space:]]*Title:[[:space:]]*(.*) ]]; then
      TITLE="${BASH_REMATCH[1]}"
    fi
    CODE_BLOCK="${CODE_BLOCK}${line}"$'\n'
  fi
done < "$TMP_FILE"

rm "$TMP_FILE"

# --------- CODE EXTRACTOR BY TARGET DIRECTORY ---------
for CODE_FILE in "${CODE_FILES[@]}"; do
  echo "Processing $CODE_FILE for src target directories..."
  grep '^// src/' "$CODE_FILE" | while read -r line; do
    TARGET_DIR=$(echo "$line" | sed -E 's|// (src/[^ ]*)|\1|')
    FILE_NAME=$(basename "$TARGET_DIR")
    DIR_PATH=$(dirname "$TARGET_DIR")

    mkdir -p "$DIR_PATH"

    awk -v target="$line" '
      BEGIN { in_block=0; }
      $0 == target { in_block=1; next }
      /^\/\/ src\// && in_block { exit }
      in_block { print }
    ' "$CODE_FILE" > "$TARGET_DIR"

    echo "Saved code block to $TARGET_DIR"
  done
done
````

---

### ✅ **How to use**

```bash
chmod +x combined_extractor.sh
./combined_extractor.sh your-markdown-file.md
```

---

### ✅ **What it does**

* First extracts code blocks from Markdown → saves in `output/<title>/<language>/<language>-<index>.<ext>`
* Then for each code file:

  * Finds `// src/...` lines
  * Saves corresponding code block into the target directory

---

### 📌 **Example flow**

Given input file:

````markdown
```typescript
// Title: Example
// src/src/example/hello.ts
console.log("Hello, world!");
````

```
It will create:
```

output/example/typescript/typescript-1.ts
src/example/hello.ts  # code saved here

```

---

If you'd like:
✅ add dry-run mode  
✅ validate target paths  
✅ add logs or summary report  

Would you like these enhancements? 🚀
```

