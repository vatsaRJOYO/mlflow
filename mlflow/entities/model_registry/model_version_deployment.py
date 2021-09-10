from mlflow.entities.model_registry._model_registry_entity import _ModelRegistryEntity
from mlflow.protos.model_registry_pb2 import ModelVersionDeployment as ProtoModelVersionDeployment


class ModelVersionDeployment(_ModelRegistryEntity):
    """Deployment object associated with model version"""

    def __init__(
        self,
        id,
        environment,
        service_name,
        jira_id=None,
        status=None,
        creation_timestamp=None,
        last_updated_timestamp=None,
        message=None,
        job_url=None,
        helm_url=None,
        cpu=None,
        memory=None,
        initial_delay=None,
        overwrite=False,
    ):

        super().__init__()
        self._service_name = service_name
        self._id = id
        self._environment = environment
        self._jira_id = jira_id
        self._status = status
        self._creation_timestamp = creation_timestamp
        self._last_updated_timestamp = last_updated_timestamp
        self._message = message
        self._job_url = job_url
        self._helm_url = helm_url
        self._cpu = cpu
        self._memory = memory
        self._initial_delay = initial_delay
        self._overwrite = overwrite


    @property
    def service_name(self):
        return self._service_name

    @property
    def id(self):
        return self._id

    @property
    def environment(self):
        return self._environment

    @property
    def jira_id(self):
        return self._jira_id

    @property
    def status(self):
        return self._status

    @property
    def creation_timestamp(self):
        return self._creation_timestamp

    @property
    def last_updated_timestamp(self):
        return self._last_updated_timestamp

    @property
    def message(self):
        return self._message

    @property
    def job_url(self):
        return self._job_url

    @property
    def helm_url(self):
        return self._helm_url

    @property
    def cpu(self):
        return self._cpu

    @property
    def memory(self):
        return self._memory

    @property
    def initial_delay(self):
        return self._initial_delay

    @property
    def overwrite(self):
        return self._overwrite
    
    @service_name.setter
    def version(self, service_name):
        self._service_name = service_name

    @id.setter
    def id(self, id):
        self._id = id

    @environment.setter
    def environment(self, environment):
        self._environment = environment

    @jira_id.setter
    def jira_id(self, jira_id):
        self._jira_id = jira_id

    @status.setter
    def status(self, status):
        self._status = status

    @creation_timestamp.setter
    def creation_timestamp(self, creation_time):
        self._creation_timestamp = creation_time

    @last_updated_timestamp.setter
    def last_updated_timestamp(self, last_updated_time):
        self._last_updated_timestamp = last_updated_time

    @message.setter
    def message(self, message):
        self._message = message

    @job_url.setter
    def job_url(self, job_url):
        self._job_url = job_url

    @helm_url.setter
    def helm_url(self, helm_url):
        self._helm_url = helm_url

    @cpu.setter
    def cpu(self, cpu):
        self._cpu = cpu

    @memory.setter
    def memory(self, memory):
        self._memory = memory

    @initial_delay.setter
    def initial_delay(self, initial_delay):
        self._initial_delay = initial_delay

    @overwrite.setter
    def overwrite(self, overwrite):
        self._overwrite = overwrite
    

    @classmethod
    def _properties(cls):
        return sorted(cls._get_properties_helper())
    
    @classmethod
    def from_proto(cls, proto: ProtoModelVersionDeployment):
        # input: mlflow.protos.model_registry_pb2.ModelVersionDeployment
        # returns: ModelVersionDeployment entity

        model_version_deployment = cls(
            proto.id,
            proto.environment,
            proto.service_name,
            proto.creation_timestamp,
            proto.jira_id,
            proto.status,
            proto.last_updated_timestamp,
            proto.message,
            proto.job_url,
            proto.helm_url,
            proto.cpu,
            proto.memory,
            proto.initial_delay,
            proto.overwrite,
        )
        return model_version_deployment
    
    def to_proto(self):

        mvd = ProtoModelVersionDeployment()
        mvd.id = str(self.id)
        mvd.environment = self.environment
        mvd.service_name = self.service_name
        mvd.creation_timestamp = self.creation_timestamp


        if self.jira_id is not None:
            mvd.jira_id = self.jira_id
        if self.status is not None:
            mvd.status = self.status
        if self.last_updated_timestamp is not None:
            mvd.last_updated_timestamp = self.last_updated_timestamp
        if self.message is not None:
            mvd.message = self.message
        if self.job_url is not None:
            mvd.job_url = str(self.job_url)
        if self.helm_url is not None:
            mvd.helm_url = str(self.helm_url)
        if self.cpu is not None:
            mvd.cpu = self.cpu
        if self.memory is not None:
            mvd.memory = self.memory
        if self.initial_delay is not None:
            mvd.initial_delay = self.initial_delay
        if self.overwrite is not None:
            mvd.overwrite = self.overwrite
        
        return mvd



    
    
    



        