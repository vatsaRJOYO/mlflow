import logging
from mlflow.protos.databricks_pb2 import PUBLIC
from mlflow.exceptions import MlflowException
import requests

_logger = logging.getLogger(__name__)
class JenkinsRestApiClient():

    def __init__(self, uri:str, token_key: str, token:str):
        self.uri = uri
        self.token_key = token_key
        self.token = token
    
    def _setAuthHeader(self, session: requests.Session):
        session.headers.update({'Authorization': 'Basic {}'.format(self.token)})
    
    def _setTokenKey(self, params: dict) -> dict:
        params['token'] = self.token_key
        return params

    
    
    def triggerJob(self, params:dict):
        response = None
        with requests.Session() as sess:
            self._setAuthHeader(session=sess)
            params = self._setTokenKey(params=params)
            try:
                response = sess.get(self.uri, params=params)
            except Exception:
                raise MlflowException(
                    'Something wrong while requesting jenkins {} with params {}'.format(self.uri, params),
                    PUBLIC
                )
        
        return response

                

    
