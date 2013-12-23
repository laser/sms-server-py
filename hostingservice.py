from abc import ABCMeta, abstractmethod

class HostingService:
  __metaclass__ = ABCMeta

  @abstractmethod
  def host_file(self, file, retries): pass
