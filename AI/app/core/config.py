from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Despho Backend"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    GEMINI_API_KEY: str 

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()