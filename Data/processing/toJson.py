import json
import os

def parse_multiple_blocks(text):
    # 빈 줄 기준으로 블록 분리
    raw_blocks = [b.strip() for b in text.strip().split("\n \n") if b.strip()]

    parsed_blocks = []

    print(raw_blocks, len(raw_blocks), end='\n\n')

    speaker = ""
    lyrics_lines = []

    for idx, block in enumerate(raw_blocks):
        lines = block.split("\n")

        # 첫 줄이 (SPEAKER) 라인인지 확인
        firstLine = lines[0].strip()
        if firstLine.startswith("(") and firstLine.endswith(")"):
            if idx != 0:
                lyrics_text = "\n".join(lyric_lines).strip() + "\n"

                parsed_blocks.append({
                    "speaker": speaker,
                    "lyrics": lyrics_text
                })

            speaker = firstLine
            lyric_lines = lines[1:]
        else:
            lyric_lines = lyric_lines + lines


    lyrics_text = "\n".join(lyric_lines).strip() + "\n"

    parsed_blocks.append({
        "speaker": speaker,
        "lyrics": lyrics_text
    })

    return parsed_blocks


def parse_txt_file(input_path, output_path=None):
    # txt 파일 읽기
    with open(input_path, "r", encoding="utf-8") as f:
        text = f.read()

    # 텍스트 처리
    result = parse_multiple_blocks(text)

    # JSON 파일로 저장(옵션)
    if output_path:
        with open(output_path, "w", encoding="utf-8") as out:
            json.dump(result, out, indent=4, ensure_ascii=False)

    return result


# -----------------------------
# 사용 예시
# -----------------------------
# lyrics.txt 파일을 읽어서 parsed.json 으로 저장
print(os.getcwd())
parsed_json = parse_txt_file("input.txt", "parsed.json")

# 콘솔에 출력
# print(json.dumps(parsed_json, indent=4, ensure_ascii=False))
