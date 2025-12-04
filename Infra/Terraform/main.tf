provider "aws" {
  region = "us-east-1"
}
resource "aws_security_group" "ec2_sg" {
  name = "ec2_security_group"
  description = "Allow SSH inbound traffic"
    ingress  {
        from_port=22
        to_port=22
        protocol="tcp"
        cidr_blocks=["0.0.0.0/0"]
    }
    egress  {
        from_port=0
        to_port=0
        protocol="-1"
        cidr_blocks=["0.0.0.0/0"]
    }
}

resource "aws_instance" "my_ec2" {
    ami = "ami-0c02fb55956c7d316"
    instance_type = "t3.micro"
    key_name = "web3"
    security_groups = [aws_security_group.ec2_sg.name]
  tags = {
    Name="MyTerraformEC2"
  }
}