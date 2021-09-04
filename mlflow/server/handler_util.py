import logging
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.exceptions import MlflowException
from mlflow.entities.model_registry.registered_model import RegisteredModel
from mlflow.entities.model_registry.model_version import ModelVersion


_logger = logging.getLogger(__name__)

def _validate_string(value:str, human_readable_name: str, error_suffix:str = ''):
    if value is None or value == "":
        raise MlflowException(human_readable_name + " cannot be empty for deployment."+ error_suffix, INVALID_PARAMETER_VALUE)


def deploy_model_version(oyo_environemnt:str, oyo_service_name:str, model_version:ModelVersion, registered_model:RegisteredModel ):
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

    
