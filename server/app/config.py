import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_ORG: str = os.getenv("GITHUB_ORG", "")
    GITHUB_REPO: str = os.getenv("GITHUB_REPO", "")

    SLACK_BOT_TOKEN: str = os.getenv("SLACK_BOT_TOKEN", "")
    SLACK_SIGNING_SECRET: str = os.getenv("SLACK_SIGNING_SECRET", "")
    SLACK_SURVEY_CHANNEL: str = os.getenv("SLACK_SURVEY_CHANNEL", "")

    ALERT_THRESHOLD_PCT: int = int(os.getenv("ALERT_THRESHOLD_PCT", "20"))
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", "8000"))

    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176",
    ).split(",")


settings = Settings()
