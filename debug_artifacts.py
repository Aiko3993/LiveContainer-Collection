import os
import sys
import logging

# Add the scripts directory to path
sys.path.append(os.path.join(os.getcwd(), '.github', 'scripts'))

from utils import GitHubClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_app(client, name, repo, workflow_file, artifact_name):
    logger.info(f"Testing {name} ({repo})...")
    
    workflow_run = client.get_latest_workflow_run(repo, workflow_file)
    if not workflow_run:
        logger.error(f"  No successful workflow run found for {name} ({workflow_file})")
        return
    
    logger.info(f"  Found workflow run: {workflow_run['id']} (SHA: {workflow_run['head_sha'][:7]})")
    
    artifacts = client.get_workflow_run_artifacts(repo, workflow_run['id'])
    if not artifacts:
        logger.error(f"  No artifacts found for run {workflow_run['id']}")
        return
    
    artifact = next((a for a in artifacts if a['name'] == artifact_name), None)
    if not artifact:
        logger.error(f"  Artifact '{artifact_name}' not found. Available: {[a['name'] for a in artifacts]}")
        return
    
    logger.info(f"  Found artifact: {artifact['name']} ({artifact['id']}, {artifact['size_in_bytes']} bytes)")
    
    # Test current repo detection
    current_repo = client.get_current_repo()
    logger.info(f"  Current repo detected: {current_repo}")
    
    if client.token:
        logger.info("  Token is present. Attempting to check app-artifacts release...")
        tag_name = "app-artifacts"
        if current_repo:
            release = client.get_release_by_tag(current_repo, tag_name)
            if release:
                logger.info(f"  Found release: {release['name']} (ID: {release['id']})")
            else:
                logger.info(f"  Release {tag_name} not found in {current_repo}")
    else:
        logger.warning("  No GITHUB_TOKEN provided. Cannot test download/upload.")

if __name__ == "__main__":
    token = os.environ.get('GITHUB_TOKEN')
    client = GitHubClient(token)
    
    # Test Play!
    test_app(client, "Play! (Nightly)", "jpd002/Play-", "build-ios.yaml", "Play_iOS")
    
    print("-" * 40)
    
    # Test Amethyst
    test_app(client, "Amethyst (Nightly)", "AngelAuraMC/Amethyst-iOS", "development.yml", "org.angelauramc.amethyst-ios.ipa")
