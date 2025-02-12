
Creating garage cluster layout
# run status to get node id
garage status
# id example "1f6f6cd31443c8a7"
# create layout with a zone -z and capacity -c 
garage layout assign -z eune -c 10G <node_id>
# apply layout
garage layout apply --version 1

# create a bucket
garage bucket create <bucket_name>
# get info on bucket
garage bucket info <bucket_name>

# creating API KEY (copy private key to env)
garage key create <key_name>

# key info
garage key list
garage key info <key_name>

# allow key to acces bucket
garage bucket allow --read --write --owner <bucket_name> --key <key_name>