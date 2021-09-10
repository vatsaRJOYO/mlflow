from mlflow.server.rest_clients.JenkinsRestApi import JenkinsRestApiClient
import logging
import os
from mlflow.protos.databricks_pb2 import INTERNAL, INVALID_PARAMETER_VALUE, PUBLIC
from mlflow.exceptions import MlflowException
from mlflow.entities.model_registry.registered_model import RegisteredModel
from mlflow.entities.model_registry.model_version import ModelVersion
from functools import reduce

JENKINS_URL_PREFIX='JENKINS_URL_{}'
JENKINS_TOKEN_KEY_PREFIX='JENKINS_TOKEN_KEY_{}'
JENKINS_TOKEN_PREFIX='JENKINS_TOKEN_{}'

JENKINS_CONFIGS_KEYS = [JENKINS_URL_PREFIX, JENKINS_TOKEN_KEY_PREFIX, JENKINS_TOKEN_PREFIX]

_jenkins_clients = None


_logger = logging.getLogger(__name__)

def _getJenkinsClient(environment:str):
    global _jenkins_clients

    if _jenkins_clients is None:
        _jenkins_clients = {}
        envs = os.environ.get('DEPLOYMENT_ENVS')
        if envs is None:
            raise MlflowException('Cannot deploy due to bad jenkins environment variable config. Contact administrator for further details.', INTERNAL)
        envs_list = envs.strip().split(',')
        for env_name in envs_list:
            env_name_caps = env_name.upper()
            _config = [ os.environ.get(conf.format(env_name_caps)) for conf in JENKINS_CONFIGS_KEYS]
            _logger.log(logging.INFO, _config)
            if reduce(lambda a, b: a and b , map(lambda a: a is not None, _config)):
                _jenkins_clients[env_name] = JenkinsRestApiClient(*_config)
                _logger.log(logging.INFO, env_name+':  '+str(JenkinsRestApiClient))
    
    return _jenkins_clients.get(environment, None)

def _validate_string(value:str, human_readable_name: str, error_suffix:str = ''):
    if value is None or value == "":
        raise MlflowException(human_readable_name + " cannot be empty for deployment."+ error_suffix, INVALID_PARAMETER_VALUE)


def _stringNotEmptyOrNone(a) -> bool:
    return a is not None and a != ''


def deploy_model_version(
    oyo_environemnt:str, 
    oyo_service_name:str, 
    model_version:ModelVersion, 
    registered_model:RegisteredModel,
    overwrite: bool,
    cpu: str,
    memory: str,
    initial_delay: str,
    ):
    model_name = model_version.name
    model_version_number = model_version.version
    model_source = model_version.source
    oyo_team_name = registered_model.tags.get('team', model_version.tags.get('team', None))

    _validate_string(oyo_service_name, "Service Name")
    _validate_string(oyo_environemnt, "Deployment Environment")
    _validate_string(oyo_team_name, "Team Name", " Add team name in the registered model page so it can be reused in all versions")
    _validate_string(model_source, "Model Source")

    _logger.log(logging.INFO, "{}:{} env: {} deployed on {} {}".format(
        model_name, 
        model_version_number, 
        oyo_environemnt, 
        oyo_service_name, 
        oyo_team_name ))
    params = {}

    params['SERVICE'] = oyo_service_name
    params['TEAM'] = oyo_team_name
    params['MLFLOW_ARTIFACT_URI'] = model_source
    params['RESOURCE_OVERWRITE'] = overwrite
    if _stringNotEmptyOrNone(cpu):
        params['CPU'] = cpu
    if _stringNotEmptyOrNone(memory):
        params['MEMORY'] = memory
    if _stringNotEmptyOrNone(initial_delay):
        params['INITIAL_DELAY_SEC '] = initial_delay
    
    

    client = _getJenkinsClient(environment=oyo_environemnt)
    if client is None:
        raise MlflowException('Jenkins client not found', PUBLIC)
        
    response = client.triggerJob(params)

    if response.status_code != 201:
        raise MlflowException('Jenkins job Trigger failed with status code: {}'.format(response.status_code), PUBLIC)
    

    
