from abc import ABCMeta, abstractmethod

class MailService:
  __metaclass__ = ABCMeta

  @abstractmethod
  def mail(self, to, cc, bcc, subject, text): pass
