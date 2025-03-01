from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import whois
import validators
from urllib.parse import urlparse
import random
import io

app = FastAPI(
    title="News Reliability Checker API",
    description="API to verify if a news URL is from a known unreliable source and return additional info.",
    version="1.0"
)

# --- Sample Dataset ---
# DATA = """
# Domain,Site Rank,Year online,Name,MBFC Fact,MBFC Bias,MBFC cred,Media Bias/Fact Check,Wiki Fake,Wiki RSP,Wiki DEPS,Wikipedia,Quality,MisinfoMe,Lang,URL,Score
# 100percentfedup.com,72284,2012,100 Percent Fed Up,L,FN,L,https://mediabiasfactcheck.com/100-percent-fed-up/,1,,,0.2,-0.9,en,https://100percentfedup.com/,0.1
# 10news.one,30000000,2017,10News.one,L,FN,L,https://mediabiasfactcheck.com/10news-one/,,,0.2,0,en,https://www.10news.one/,0.1
# 12minutos.com,276039,2008,12minutos.com,L,FN,L,https://mediabiasfactcheck.com/12minutos-com/,1,,,0.2,-1,es,https://www.12minutos.com/,0.1
# 163.com,309,1997,NetEase,M,FN,L,https://mediabiasfactcheck.com/netease-163-com-bias/,,https://en.wikipedia.org/wiki/NetEase,,0.2,zh,https://www.163.com/,0.2
# 1tv.ru,2598,2002,Channel One Russia,M,FN,L,https://mediabiasfactcheck.com/channel-one-russia-bias/,,https://en.wikipedia.org/wiki/Channel_One_Russia,,0.3,ru,https://www.1tv.ru/,0.2
# 2020conservative.com,2757810,2019,2020 Conservative,VL,FN,L,https://mediabiasfactcheck.com/2020-conservative-bias/,,,0.6,,en,https://2020conservative.com/,0
# 2020electioncenter.com,4494303,2020,Banned.Video,VL,CP,L,https://mediabiasfactcheck.com/2020electioncenter-com-bias/,,,0.3,0.6,en,https://2020electioncenter.com/,0
# 21stcenturywire.com,1161239,2009,21st Century Wire,M,CP,L,https://mediabiasfactcheck.com/21st-century-wire/,,,0.2,-0.9,en,https://21stcenturywire.com/,0.2
# 24jours.com,1162979,2017,24jours.com,L,FN,L,https://mediabiasfactcheck.com/24jours-com/,,,0.3,0.3,fr,https://www.24jours.com/,0.1
# 369news.net,30000000,2015,369 News,M,CP,L,https://mediabiasfactcheck.com/369news/,,,0.2,0,en,https://369news.net/,0.2
# 4chan.org,973,2004,4Chan,VL,FN,L,https://mediabiasfactcheck.com/4chan-bias/,,https://en.wikipedia.org/wiki/4chan,0.6,0.7,en,https://4chan.org/,0
# """

# Load the dataset into a DataFrame
df = pd.read_csv(r"filtered_mbfc_fact_1.csv")
# Normalize domain names for consistent matching
df['Domain'] = df['Domain'].str.lower()

# --- Pydantic Model for the API Response ---
class CheckNewsResponse(BaseModel):
    is_reliable: bool
    message: str
    domain: str
    whois_info: dict = None
    media_details: dict = None
    social_media_stats: dict = None

# --- Utility Function ---
def extract_domain(url: str) -> str:
    """
    Extract the domain from the provided URL.
    """
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

# --- FastAPI Endpoint ---
@app.get("/check_news", response_model=CheckNewsResponse)
def check_news(url: str):
    """
    Check the reliability of a given news article URL.
    Steps:
      1. Validate the URL.
      2. Extract the domain.
      3. Check the domain against the known unreliable sources dataset.
      4. Retrieve WHOIS info for additional domain data.
      5. Simulate social media share stats.
    """
    # Validate URL
    if not validators.url(url):
        raise HTTPException(status_code=400, detail="Invalid URL provided.")
    
    domain = extract_domain(url)
    
    # Look for the domain in our dataset
    match = df[df['Domain'] == domain]
    
    # Retrieve WHOIS info (using python-whois module)
    try:
        whois_info = whois.whois(url)
        # Ensure we only return serializable info
        if isinstance(whois_info, dict):
            whois_info = {k: str(v) for k, v in whois_info.items() if v is not None}
        else:
            whois_info = {}
    except Exception as e:
        whois_info = {"error": f"Could not retrieve WHOIS info: {str(e)}"}
    
    # Determine if the source is flagged in our dataset
    if not match.empty:
        message = "This website is in the list of known unreliable sources."
        is_reliable = False
        media_details = {
            "Name": match.iloc[0]['Name'],
            "MBFC Fact": match.iloc[0]['MBFC Fact'],
            "MBFC Bias": match.iloc[0]['MBFC Bias'],
            "Media Bias/Fact Check": match.iloc[0]['Media Bias/Fact Check'],
            # "Quality": match.iloc[0]['Quality'],
            # "Score": match.iloc[0]['Score']
        }
    else:
        message = "No flagged misinformation detected."
        is_reliable = True
        media_details = {}
    
    # Simulated social media statistics (dummy data)
    social_media_stats = {
        "twitter_shares": random.randint(0, 1000),
        "facebook_shares": random.randint(0, 1000),
        "reddit_mentions": random.randint(0, 1000)
    }
    
    return CheckNewsResponse(
        is_reliable=is_reliable,
        message=message,
        domain=domain,
        whois_info=whois_info,
        media_details=media_details,
        social_media_stats=social_media_stats
    )

# --- Run the application ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
