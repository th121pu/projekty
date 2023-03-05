#pip install azure-storage-blob
# navod https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-python?tabs=environment-variable-windows

import os, uuid
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__

try:
    print("Azure Blob Storage v" + __version__ + " - Python quickstart sample")
    connect_str = "DefaultEndpointsProtocol=https;AccountName=cloudtukea581;AccountKey=r6rpcezOYSRb9fymRpu06cDSt9kYsb95riwmSSxi32VF062v6oD5zwwTua0Zl06WIHpn8cLEZvjNRLxCJr6Org==;EndpointSuffix=core.windows.net"
    # Quick start code goes here

except Exception as ex:
    print('Exception:')
    print(ex)

blob_service_client = BlobServiceClient.from_connection_string(connect_str)
# Create a unique name for the container
container_name = str("tuke")

# Create the container
container_client = blob_service_client.get_container_client(container_name)

# PART 1 CREATE BLOB
# Create a local directory to hold blob data
#local_path = "./data"
#os.mkdir(local_path)

# Create a file in the local data directory to upload and download
#local_file_name = str(uuid.uuid4()) + ".txt"
#upload_file_path = os.path.join(local_path, local_file_name)

# Write text to the file
#file = open(upload_file_path, 'w')
#file.write("Hello, World!")
#file.close()

# Create a blob client using the local file name as the name for the blob
#blob_client = blob_service_client.get_blob_client(container=container_name, blob=local_file_name)

#print("\nUploading to Azure Storage as blob:\n\t" + local_file_name)

# Upload the created file
#with open(upload_file_path, "rb") as data:
    #blob_client.upload_blob(data)

#PART 2 - GET ALL BLOBS WITH URL
print("\nListing blobs...")

# List the blobs in the container
blob_list = container_client.list_blobs()
for blob in blob_list:
    print("\t" + blob.name)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob.name)
    print(blob_client.url)